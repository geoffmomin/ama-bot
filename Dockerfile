# This dockerfile has been built using https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

FROM node:boron

WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . .

# Configuration (parameters, API keys...)
VOLUME /usr/src/app/config
EXPOSE 3000

# Script `npm start` is defined in package.json
CMD ["npm", "start"]
