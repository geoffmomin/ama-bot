# This file has been written using these recommendations
# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
# https://github.com/nodejs/docker-node/
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md

FROM node:alpine
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . .

# Configuration (parameters, API keys...)
VOLUME /usr/src/app/config
EXPOSE 3000

ENV NODE_ENV production
ENV NPM_CONFIG_LOGLEVEL info

USER node
CMD ["node", "app.js"]
