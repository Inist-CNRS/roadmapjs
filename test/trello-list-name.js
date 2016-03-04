/*jshint node:true,laxcomma:true*/
/* global describe, it */
'use strict';
var assert = require('assert');
var tlnp   = require('../helpers/trello-list-name-parser.js');

describe('the trello list name parser', function () {

  var listNameMAMA = 'Janvier 2015 - Février 2015';
  it('should parse "' + listNameMAMA + '"', function() {
    var range = tlnp(listNameMAMA);
    assert.equal(range[0].format('YYYY-MM-DD'), '2015-01-01');
    assert.equal(range[1].format('YYYY-MM-DD'), '2015-03-01');
  });

  var listNameMAMA2 = 'Janvier 2015 - Fevrier 2015';
  it('should parse "' + listNameMAMA2 + '"', function() {
    var range = tlnp(listNameMAMA2);
    assert.equal(range[0].format('YYYY-MM-DD'), '2015-01-01');
    assert.equal(range[1].format('YYYY-MM-DD'), '2015-03-01');
  });
  
  var listNameMA = 'Janvier 2015';
  it('should parse "' + listNameMA + '"', function() {
    var range = tlnp(listNameMA);
    assert.equal(range[0].format('YYYY-MM-DD'), '2015-01-01');
    assert.equal(range[1].format('YYYY-MM-DD'), '2015-02-01');
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
    assert.equal(range[1].format('YYYY-MM-DD'), '2016-01-01');
  });

  var listNameMMA = 'janvier-mars 2016';
  it('should parse "' + listNameMMA + '"', function() {
    var range = tlnp(listNameMMA);
    assert.equal(range[0].format('YYYY-MM-DD'), '2016-01-01');
    assert.equal(range[1].format('YYYY-MM-DD'), '2016-04-01');
  });

  var listNameMMA2 = 'XXXXXXX janvier-mars 2016';
  it('should parse "' + listNameMMA2 + '"', function() {
    var range = tlnp(listNameMMA2);
    assert.equal(range[0].format('YYYY-MM-DD'), '2016-01-01');
    assert.equal(range[1].format('YYYY-MM-DD'), '2016-04-01');
  });

  var listNameTA = '1er trimestre 2016';
  it('should parse "' + listNameTA + '"', function() {
    var range = tlnp(listNameTA);
    assert.equal(range[0].format('YYYY-MM-DD'), '2016-01-01');
    assert.equal(range[1].format('YYYY-MM-DD'), '2016-04-01');
  });

  var listNameTA2 = '2eme trimestre 2016';
  it('should parse "' + listNameTA2 + '"', function() {
    var range = tlnp(listNameTA2);
    assert.equal(range[0].format('YYYY-MM-DD'), '2016-04-01');
    assert.equal(range[1].format('YYYY-MM-DD'), '2016-07-01');
  });

  var listNameTA3 = '2ème trimestre 2016';
  it('should parse "' + listNameTA3 + '"', function() {
    var range = tlnp(listNameTA3);
    assert.equal(range[0].format('YYYY-MM-DD'), '2016-04-01');
    assert.equal(range[1].format('YYYY-MM-DD'), '2016-07-01');
  });

});