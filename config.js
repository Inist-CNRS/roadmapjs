'use strict';

var nconf = require('nconf');

// charge la configuration locale
var configLocal = {};
try {
  configLocal = require('./config.local.js');
} catch (err) {}

nconf.overrides(configLocal);
nconf.defaults({
  key: '',
  token: '',
  boards: {}  
});

module.exports = nconf.get();