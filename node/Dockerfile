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
 
# Install Puppeteer dependencies
# RUN apt-get update && apt-get install -y \
#     libnss3 libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 \
#     libxi6 libxtst6 libcups2 libxrandr2 libasound2 \
#     libatk1.0-0 libgtk-3-0 libpangocairo-1.0-0 libxss1 libdbus-glib-1-2 \
#     libgbm-dev \
#     --no-install-recommends && apt-get clean && rm -rf /var/lib/apt/lists/*


CMD ["node", "./dist/index.js"]