FROM node:4.3.1

ADD . /app
WORKDIR /app
RUN npm install

VOLUME /app/data

CMD ["npm", "start"]
EXPOSE 3000