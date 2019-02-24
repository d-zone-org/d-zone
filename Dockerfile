FROM node:8

COPY . .

WORKDIR .

RUN npm install

RUN npm run-script build

CMD ["npm", "start"]

