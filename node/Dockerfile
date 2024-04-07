FROM node:18

WORKDIR /usr/src/app

COPY ./node/package*.json ./

RUN npm install

RUN mkdir dist

COPY ./node/dist ./dist

COPY ./.env ./

CMD ["node", "./dist/index.js"]