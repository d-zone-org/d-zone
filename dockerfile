#syntax=docker/dockerfile:1.0

FROM node:16 as base
WORKDIR /d-zone
COPY .yarn .yarn
COPY packages packages
COPY package.json .yarnrc.yml yarn.lock ./
RUN yarn

FROM base as web
WORKDIR /d-zone/packages/web
CMD [ "yarn", "dev" ]

FROM base as server
WORKDIR /d-zone/packages/server
CMD [ "yarn", "dev" ]

FROM base as web-production
WORKDIR /d-zone/packages/web
RUN yarn build
CMD [ "yarn", "start" ]

FROM base as server-production
WORKDIR /d-zone/packages/server
RUN yarn build
CMD [ "yarn", "start" ]

FROM nginx:latest as nginx
RUN rm /etc/nginx/conf.d/*
COPY ./nginx.conf /etc/nginx/conf.d/
CMD [ "nginx", "-g", "daemon off;" ]
