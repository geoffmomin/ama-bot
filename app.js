const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let secrets;

try {
  secrets = {
    dialogflow: {
      clientAccessToken: process.env.dialogflow_clientAccessToken
    },
    smooch: {
      appId: process.env.smooch_appId,
      keyId: process.env.smooch_keyId,
      secretKey: process.env.smooch_secretKey
    }
  };

  secrets = require('./config/secrets.json');
} catch (e) {}

const Apiai = require('apiai');
let dialog = Apiai(secrets.dialogflow.clientAccessToken);

const Smooch = require('smooch-core');
const smooch = new Smooch({
    keyId: secrets.smooch.keyId,
    secret: secrets.smooch.secretKey,
    scope: 'app'
});

app.use('/webchat/:appId', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  let appId = secrets.smooch.appId;
  res.redirect(`/webchat/${appId}`);
});

// POST webhook route for Smooch
app.post('/', (req, res) => {
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

let port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App running on port ${port}`));
