FROM node:18

WORKDIR /usr/src/app

COPY ./node/package*.json ./

RUN npm install

RUN mkdir dist

COPY ./node/dist ./dist

COPY ./.env ./
COPY ./certs/certificate.crt ./
COPY ./certs/private.key ./

RUN mkdir -p /mnt/tppl03s005/resources/operations/sky/shift/plan/daily
# COPY ./node/mnt/tppl03s005/resources/operations/sky/shift/plan/daily/auto-plan-update.xlsx ./mnt/tppl03s005/resources/operations/sky/shift/plan/daily
 
CMD ["node", "./dist/index.js"]