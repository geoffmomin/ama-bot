let apiai = require('apiai');

let secrets = require('./config/secrets.json');
let app = apiai(secrets.dialogflow.clientAccessToken);

const express = require('express');
const app2 = express();

app2.post('/', function (req, res) {
  let json = req.body;
  let textQuery = json.textQuery;
  let uniqueSessionId = json.uniqueSessionId;
  // let textQuery = 'How old are you?';
  // let uniqueSessionId = '1234';

  let request = app.textRequest(textQuery, { sessionId: uniqueSessionId });

  request.on('response', function(response) {
    res.send(response);
  });

  request.on('error', function(error) {
    res.status(500).send(error);
  });

  request.end();
});

app2.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
