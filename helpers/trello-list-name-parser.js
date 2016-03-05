'use strict';

var moment   = require('moment');
var latinize = require('latinize');

moment.locale('fr');

// "1er trimestre 2016" / "2eme trimestre 2016"
// "XXXXXX janvier-mars 2016"
// "Janvier 2016"
// "Janvier 2016 - Février 2016"
// "2014"
// "2014-2015"
module.exports = function (listName) {
  try {
    // // format = 1 : "Janvier 2014 - Février 2015"
    // // format = 2 : "2014 - 2015"
    // // format = 3 : "2014"
    // var format = [ '', '' ]; // mounth or year

    var range = listName.split('-').map(function (s) { return latinize(s.trim().toLowerCase()); });

    // check if more than one separator in the string
    if (range.length > 2) {
      return new Error('Trello list name have too many hyphens: ' + listName);
    }

    // if "1er trimestre 2016" or "2eme trimestre 2016"
    var res = new RegExp('^(1er|[2-4]eme) trimestre ([0-9]+)$').exec(range[0]);
    if (res) {
      if (res[1] == '1er') {
        range[0] = 'janvier ' + res[2];
        range[1] = 'mars ' + res[2];
      } else if (res[1] == '2eme') {
        range[0] = 'avril ' + res[2];
        range[1] = 'juin ' + res[2];
      } else if (res[1] == '3eme') {
        range[0] = 'juillet ' + res[2];
        range[1] = 'septembre ' + res[2];
      } else if (res[1] == '4eme') {
        range[0] = 'octobre ' + res[2];
        range[1] = 'decembre ' + res[2];
      }
    }

    // if only one date in the trello list, then
    // create a range from this date
    // ex: 2014 => 2014-2014
    //     février 2015 => février 2015-février 2015
    if (range.length == 1) {
      range[1] = range[0];
    }

    // fix wrong french date string (ex: Aout vs Août)
    range = range.map(function (d) {
      return d.replace('aout', 'août')
              .replace('fevrier', 'février')
              .replace('decembre', 'décembre');
    });

    // take the last word of the string if there is no years into
    // then it should be a month
    range = range.map(function (d) {
      if (!new RegExp('[0-9]+$').test(d)) {
        return d.split(' ').pop();
      } else {
        return d;
      }
    });

    // handle year for the first part of the range 
    // if year is not indicated
    //   "XXXXXX janvier-mars 2016"
    if (!new RegExp('[0-9]+$').test(range[0])) {
      res = new RegExp('([0-9]+)$').exec(range[1]);
      if (res) {
        var year = res[1];
        range[0]  += ' ' + year;
      } else {
        return new Error('Trello list name do not have years in the second part: ' + listName);
      }
    }

    // parse as a date first string and second string
    if (new RegExp('^[0-9]+$').test(range[0])) {
      range[0] = moment(range[0], "YYYY");
    } else {
      range[0] = moment(range[0], "MMMM YYYY");
    }
    if (new RegExp('^[0-9]+$').test(range[1])) {
      range[1] = moment(range[1], "YYYY").add(1, 'years');
    } else {
      range[1] = moment(range[1], "MMMM YYYY").add(1, 'months');
    }

    // crash test (throw an error if one is not a date)
    range[0].format('YYYY-MM-DD');
    range[1].format('YYYY-MM-DD');

    return range;

  } catch (err) {

    return new Error(err);
  
  }
};
