/*jshint node:true, laxcomma:true*/
"use strict";

module.exports = function(config, start) {
  config.set('theme', __dirname);
  start();
};

if (!module.parent) {
  require('castor-core')(module.exports);
}
