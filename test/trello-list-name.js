/*jshint node:true,laxcomma:true*/
/* global describe, it */
'use strict';
var assert = require('assert');
var tlnp   = require('../helpers/trello-list-name-parser.js');

describe('the trello list name parser', function () {

  var listNameJAFA = 'Janvier 2015 - Février 2015';
  it('should parse "' + listNameJAFA + '"', function() {
    var range = tlnp(listNameJAFA);
    assert.equal(range[0].format('YYYY-MM-DD'), '2015-01-01');
    assert.equal(range[1].format('YYYY-MM-DD'), '2015-02-01'); // should be '2015-03-01'
  });

  var listNameJAFA2 = 'Janvier 2015 - Fevrier 2015';
  it('should parse "' + listNameJAFA2 + '"', function() {
    var range = tlnp(listNameJAFA2);
    assert.equal(range[0].format('YYYY-MM-DD'), '2015-01-01');
    assert.equal(range[1].format('YYYY-MM-DD'), '2015-02-01'); // should be '2015-03-01'
  });

  var listNameA = '2015';
  it('should parse "' + listNameA + '"', function() {
    var range = tlnp(listNameA);
    assert.equal(range[0].format('YYYY-MM-DD'), '2015-01-01');
    assert.equal(range[1].format('YYYY-MM-DD'), '2016-01-01');
  });

  var listNameAA = '2014-2015';
  it('should parse "' + listNameAA + '"', function() {
    var range = tlnp(listNameAA);
    assert.equal(range[0].format('YYYY-MM-DD'), '2014-01-01');
    assert.equal(range[1].format('YYYY-MM-DD'), '2015-01-01'); // should be '2016-01-01'
  });

});