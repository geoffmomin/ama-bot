# ama-bot
Bot ask for asking me anything. (Smooch.io + Dialogflow + GitHub Issues + Node.js)

Test the bot here: https://mycaule.github.io/ama-bot/

![screenshot](images/screenshot.png)

Proof of concept of a chatbot with integrated backoffices:
 - Dialogflow for user intent configuration,
 - GitHub issues for fallbacks.

## Setup

Fill in the secrets file with API keys `config/secrets.json`.

```
npm install
nodemon app.js
ngrok http 3000
```

Configure the following two Smooch integration in their web interface:
- Web messenger
- Webhooks

## Routes

Available HTTP routes are:
- `GET /`: A web interface for the chatbot,
- `POST /`: A webhook implementing Smooch and Dialogflow REST API calls.

## TODO
- [x] Implement a webchat bot on Smooch.io
- [x] [Dialogflow](https://dialogflow.com) and Smalltalk Intent
- [ ] Internet Knowledge for questions off topic
  - Google Answer box
  - [DuckDuckGo Instant Answer API](https://duckduckgo.com/api)
  - [Wolfram API](https://products.wolframalpha.com/api/)
- [ ] [Google API](https://www.npmjs.com/package/googleapis)
  - Calendar integration
- [ ] Fill in [Github Issue](https://developer.github.com/v3/issues/) for unanswered questions like in [sindresorhus/ama](https://github.com/sindresorhus/ama)
