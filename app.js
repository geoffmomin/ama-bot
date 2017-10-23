const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let secrets = require('./config/secrets.json');

const Apiai = require('apiai');
let dialog = Apiai(secrets.dialogflow.clientAccessToken);

const Smooch = require('smooch-core');
const smooch = new Smooch({
    keyId: secrets.smooch.keyId,
    secret: secrets.smooch.secretKey,
    scope: 'app'
});

// Default GET route for the web messenger client
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use('/coverr', express.static(__dirname + '/coverr'));
app.use('/smooch', express.static(__dirname + '/smooch'));

// POST webhook route for Smooch
app.post('/', function (req, res) {
  let json = req.body;

  let textQuery = json.messages ? json.messages[0].text : "";
  let appUserId = json.appUser._id;

  let request = dialog.textRequest(textQuery, { sessionId: appUserId });

  request.on('response', function(dialogRes) {
    smooch.appUsers.sendMessage(appUserId, {
      type: 'text',
      text: dialogRes.result.fulfillment.speech,
      role: 'appMaker'
    })
    .then((smoochRes) => {
      res.send({
        dialogFlow: dialogRes,
        smooch: smoochRes
      });
    })
    .catch((err) => {
      res.status(500).send({
        dialogFlow: dialogRes,
        smooch: err
      });
    });
  });

  request.on('error', function(error) {
    res.status(500).send({
      dialogFlow: error,
      smooch: ""
    });
  });

  request.end();
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
