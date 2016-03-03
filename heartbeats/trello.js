'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:helpers:' + basename)
  , harvester  = require('../helpers/trello-harvester.js')
  ;

module.exports = function(options, core) {
  options = options || {};
  var targetDirectory = core.config.get('dataPath');
  var config = core.config.get('trello');

  // at the launch
  harvester(targetDirectory, config, function() {
    debug('harvested !');
  });

  // at each beat
  return function (heartbeat, last) {
    harvester(targetDirectory, config, function() {
      debug('harvested !');
    });
  }
}

