FROM node:4.3.1

ADD . /app
WORKDIR /app
RUN npm install

CMD ["npm", "start"]
EXPOSE 3000