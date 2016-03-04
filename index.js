'use strict'
// to allow mongodb host and port injection thanks
// to the MONGODB_PORT environment parameter
// (docker uses it)
var mongoHostPort = process.env.MONGODB_PORT ? process.env.MONGODB_PORT.replace('tcp://', '') : 'localhost:27017';

module.exports = {
  "connectionURI": 'mongodb://' + mongoHostPort + '/roadmapjs',
  "collectionName": "data",
  "browserifyModules" : [ "qs", "async", "jquery",  "react", "react-dom", "mongodb-querystring" ],
  "rootURL" : "index.html",
  "routes": [
    "table.js"
  ],
  "heartbeats": [
    {
      "beat" : 3600,
      "require": "trello.js",
      "options" : {
      }
    }
  ],
  "loaders": [
    {
      "pattern" : "**/*.json",
      "require" : "castor-load-jsoncorpus",
      "options" : {
        "cutter" : "!.*"
      }
    },
    {
      "script": "card.js",
      "pattern": "**/*.json"
    }
  ]
};
module.exports.package = require('./package.json');
