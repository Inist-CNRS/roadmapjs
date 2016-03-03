// to allow mongodb host and port injection thanks 
// to the MONGODB_PORT environment parameter
// (docker uses it)
var mongoHostPort = process.env.MONGODB_PORT ? process.env.MONGODB_PORT.replace('tcp://', '') : 'localhost:27017';

module.exports = {
  "connectionURI": 'mongodb://' + mongoHostPort + '/roadmapjs',
  "browserifyModules" : [ "qs", "async", "jquery",  "react", "react-dom" ],
  "rootURL" : "index.html",
  "routes": [
    "echo.js",
    "table.js"
  ],
  "heartbeats": [
    {
      "beat" : 1,
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
    }
  ]
};
module.exports.package = require('./package.json');
