# AskMeAnything bot
Bot ask for asking me anything. (Smooch.io + Dialogflow + GitHub Issues + Node.js).

See this blog post for explanations: https://mycaule.github.io/2017/10/24/chatbot/

Test the bot here: https://mycaule.github.io/ama-bot/

![screenshot](images/screenshot.png)

Proof of concept of a chatbot with integrated backoffices:
 - Dialogflow for user intent configuration,
 - GitHub issues for fallbacks.

Deployment follows the best practices for production as of 2017.

## Setup

1. Configure the following two Smooch integration in their web interface: Web messenger, Webhooks

2. Create an agent using Dialogflow and plug-in the Smalltalk option.

3. Fill in the secrets file with API keys `config/secrets.json`.

4. Install this app and run it!

| Domain     | Key name             | Documentation                                                                              |
|------------|----------------------|--------------------------------------------------------------------------------------------|
| DialogFlow | `clientAccessToken`  | In the Agent General properties, refer to the API keys section                             |
| Smooch     | `appId`              | `appId` can be found in the homepage `https://app.smooch.io/apps/{appId}`                  |
| Smooch     | `keyId`              | Generate this in the Secrets keys section of `https://app.smooch.io/apps/{appId}/settings` |
| Smooch     | `secretKey`          | Generate this in the Secrets keys section of `https://app.smooch.io/apps/{appId}/settings` |

## Running the code locally

```
# Install node dependencies
npm install

# App will be running on port 3000
nodemon app.js

# Generate a public URL with ngrok tunnel
ngrok http 3000
```

You also have to configure Smooch webhook url smooch with the public ngrok url at this point.

## Running the code on production

### Creating a Docker image

See [Dockerizing a Node.js web app](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/).

```
# Rebuilding the image
docker build -t mycaule/ama-bot .
```

```
# Pulling existing build from docker.io
docker pull mycaule/ama-bot

# Listing images
docker images

# Create secrets.json locally
vi config/secrets.json

# Running the image with a redirection to local port 8080
docker run -p 8080:3000 -v </full/local/path/to/config>:/usr/src/app/config -d mycaule/ama-bot

# Listing docker processes
docker ps

# Printing app output
docker logs <container id>

# Enter the container
docker exec -it <container id> /bin/bash
```

### Deploy using Heroku

See [Heroku - Container Registry & Runtime](https://devcenter.heroku.com/articles/container-registry-and-runtime)

Heroku does not support the following Dockerfile commands: `VOLUME`, `EXPOSE`.

```
heroku container:login
heroku create
heroku container:push web
```

### Deploy using Docker Cloud

- [Docker Cloud](https://cloud.docker.com/stack/deploy/?repo=https://github.com/mycaule/ama-bot): works only with AWS or Azure...

### Deploy using Google Cloud Container Engine / Kubernetes

TODO. See this [blog post from me](http://mycaule.github.io/2017/10/19/scalable-microservices-lesson2/).

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
- [ ] Orchestrate the different microservices with GraphQL.
- [ ] Fill in [Github Issue](https://developer.github.com/v3/issues/) for unanswered questions like in [sindresorhus/ama](https://github.com/sindresorhus/ama):
   - Node.js lib: https://www.npmjs.com/package/github
- [ ] Deployment methods:
  - [ ] Deploy serverless application on Cloud Functions
  - [x] Deploy application on Heroku
  - [x] Deploy packaged application on Cloud Container Engine
