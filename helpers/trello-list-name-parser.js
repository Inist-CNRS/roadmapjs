'use strict';

var moment   = require('moment');
var latinize = require('latinize');

moment.locale('fr');

module.exports = function (listName) {
  try {
    // // format = 1 : "Janvier 2014 - Février 2015"
    // // format = 2 : "2014 - 2015"
    // // format = 3 : "2014"
    // var format = [ '', '' ]; // mounth or year

    var range = listName.split('-').map(function (s) { return s.trim(); });
    if (range.length == 1) {
      // if trello list name is for example 2014
      // then range[0] = 2014 and range[1] = 2014
      if (new RegExp('^[0-9]+$').test(range[0])) {
        range[1] = '' + (parseInt(range[0], 10) + 1);
      }
    }
    // fix date string (ex: Aout vs Août)
    range = range.map(function (d) {
      return d.replace('Aout', 'Août')
              .replace('Fevrier', 'Février')
              .replace('Decembre', 'Décembre');
    });

    // parse date string as javascript date
    range = range.map(function (d) {
      if (new RegExp('^[0-9]+$').test(d)) {
        // if trello list name is for example "2014"
        return moment(d, "YYYY");
      } else {
        // if trello list name is for example "Décembre 2014"
        return moment(d, "MMMM YYYY");
      }
    });

    // crash test (throw an error if one is not a date)
    range[0].format('YYYY-MM-DD');
    range[1].format('YYYY-MM-DD');

    return range;

  } catch (err) {

    return new Error(err);
  
  }
};
