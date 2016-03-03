'use strict';

module.exports = function(options) {
  options = options || {};
  return function (input, submit) {
    if (input.content && input.content.json && input.content.json.date) {
      input.content.json.date = new Date(input.content.json.date);
    }
    submit(null, input);
  }
}

