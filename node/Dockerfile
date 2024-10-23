FROM node:18

WORKDIR /usr/src/app

COPY ./node/package*.json ./

RUN npm install

RUN mkdir dist

COPY ./node/dist ./dist

COPY ./.env ./
# COPY ./_.reconext.com.2024.pem ./
COPY ./certs/certificate.crt ./
COPY ./certs/private.key ./

CMD ["node", "./dist/index.js"]/

