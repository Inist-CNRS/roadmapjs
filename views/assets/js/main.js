"use strict";
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var bury = function bury(prefix, value) {
  if (value instanceof Date) {
    return value.valueOf().toString().concat('^D');
  }
  else if (value instanceof Boolean) {
    return value ? '1^B' : '0^B';
  }
  else if (typeof value === 'number') {
    return value.toString().concat('^N');
  }
  return value;
}
