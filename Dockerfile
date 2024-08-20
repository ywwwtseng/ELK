FROM node:16.15.0-buster-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3002
CMD [ "npm", "start" ]