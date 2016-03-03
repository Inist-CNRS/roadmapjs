'use strict';

module.exports = function(options, core) {
  options = options || {};
  return function (heartbeat, last) {
    console.log('DING');
  }
}

