FROM node:8.11.1
MAINTAINER Sai Kumar A
RUN mkdir /app
WORKDIR /app
ADD ./package.json /app/package.json
RUN yarn install
ADD . /app
