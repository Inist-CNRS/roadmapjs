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

    var range = listName.split('-').map(function (s) { return s.trim().toLowerCase(); });

    // check if more than one separator in the string
    if (range.length > 2) {
      return new Error('Trello list name have too many hyphens: ' + listName);
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
