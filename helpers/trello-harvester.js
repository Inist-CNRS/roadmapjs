'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:helpers:' + basename)
  , Trello   = require('node-trello')
  , moment   = require('moment')
  , fs       = require('fs')
  , marked   = require('marked')
  , async    = require('async')
  , latinize = require('latinize')
  ;

var errors = [];

module.exports = function (targetDirectory,  config, trelloHarvesterCb) {
  moment.locale('fr');
  var t = new Trello(config.key, config.token);

  async.eachSeries(Object.keys(config.boards), function (boardKey, cbBoardFinished) {

    debug('[' + boardKey + '][beginning] Parsing trello board ' + config.boards[boardKey].boardLink);
    var board = config.boards[boardKey];
    async.waterfall([

      // get board informations
      function (cb) {
        t.get("/1/boards/" + board.idBoard, cb);
      },

      // get board lists (date ranges)
      function (boardInfo, cb) {
        t.get("/1/boards/" + board.idBoard + '/lists', function (err, lists) {
          var boardLists = {};
          lists.forEach(function (list) {
            boardLists[list.id] = { listName: list.name };

            try {
              var range = list.name.split('-').map(function(s) { return s.trim(); });
              if (range.length == 1) {
                // if trello list name is for example 2014
                // then range[0] = 2014 and range[1] = 2015
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
                  // if trello list name is for example 2014
                  return moment(d, "YYYY");
                } else {
                  // if trello list name is for example Décembre 2014
                  return moment(d, "MMMM YYYY");
                }
              });
              boardLists[list.id].range      = range;
              boardLists[list.id].rangeLabel = 'entre ' + range[0].format('MMMM YYYY') + ' et ' + range[1].format('MMMM YYYY');
              boardLists[list.id].date       = range[0].add(Math.round(range[1].diff(range[0], 'days')/2), 'days');
              boardLists[list.id].dateLabel  = boardLists[list.id].date.format('YYYY-MM-DD');
              boardLists[list.id].dateLabel2 = boardLists[list.id].date.format('DD MMM YYYY');
              boardLists[list.id].dateLabel3 = boardLists[list.id].date.format('DD MMMM YYYY');
            } catch (err) {
              boardLists[list.id].invalidDate = true;
              var errMsg = 'Error: invalid date in board ' + boardKey + ' list ' + boardLists[list.id].listName + ' ' + err;
              errors.push([err, errMsg]);
              console.error(errMsg);
            }
          });
          cb(err, boardInfo, boardLists)
        });
      },

      function (boardInfo, boardLists, cb) {
        var project = [];

        // get the board cards one by one
        t.get("/1/boards/" + board.idBoard + "/cards", { attachments: true },
          function (err, data) {
            if (err) {
              return cb(err);
            }

            // browse the board cards by cards
            debug('[' + boardKey + '] The "' + boardInfo.name + '" board contains ' + data.length + ' cards');
            data.forEach(function (item) {

              // filter card with invalid date
              if (boardLists[item.idList].invalidDate && !item.due) {
                debug('[' + boardKey + '] Skiping card because bad date: ' + item.name);
                return;
              }

              var result = {};
              result.idBoard = board.idBoard;
              result.boardName = boardInfo.name;
              result.boardLink   = config.boards[boardKey].boardLink;
              result.projectKey  = boardKey;
              result.projectName = config.boards[boardKey].projectName;
              result.idCard = item.id;
              result.idList = item.idList;
              result.listName   = boardLists[item.idList].listName;
              result.rangeLabel = boardLists[item.idList].rangeLabel;
              result.isRange   = item.due ? false : true; // si on a une due date alors c'est pas un range de date
              result.date   = item.due ? moment(item.due).format("YYYY-MM-DD") : boardLists[item.idList].dateLabel;
              result.title  = item.name;
              result.desc   = marked(item.desc);
              result.trelloLink = item.url;
              result.image_small  =
              item.attachments.length > 0 && item.attachments[0].previews[0] ?
              item.attachments[0].previews[0].url : '';
              result.image_medium =
              item.attachments.length > 0 && item.attachments[0].previews[2] ?
              item.attachments[0].previews[2].url : '';
              result.image_big =
              item.attachments.length > 0 && item.attachments[0].previews[4] ?
              item.attachments[0].previews[4].url : '';
              debug('[' + boardKey + '] This card has been found: ' + item.name);
              result.labels = [];
              result.labelsOriginal = [];
              item.labels.forEach(function (elt) {
                result.labelsOriginal.push(elt.name);
                // transforms
                //   "Sprint Review" to "sprint-review"
                //   "Communications" to "communication"
                //   "Réunion" to "reunion"
                var label = latinize(elt.name.toLowerCase().trim().replace(/s$/, '').replace(' ', '-'));
                result.labels.push(label);
              });
              project.push(result);
            });

            return cb(null, boardInfo, project);
          });
        }
      ], function (err, boardInfo, project) {
        if (err) {
          return cbBoardFinished(err);
        }

        // write project JSON data
        debug('[' + boardKey + '] Project ' + boardKey + ' written (with ' + project.length + ' cards)');
        fs.writeFileSync(
          path.join(targetDirectory, boardKey + '.json'),
          JSON.stringify(project, null, '  ')
        );

        debug('[' + boardKey + '][finished] Parsing trello board ' + boardKey);
        console.error(boardKey + ' OK.'); // show a dot to tell the user a board has been handled
        cbBoardFinished(null); // on a terminé de traiter ce tableau
      });

    }, function (err) {
      // en cas d'erreur dans le traitement de la liste des tableaux
      if (err) {
        var errMsg = 'Error:' + err;
        errors.push([err, errMsg ]);
        console.error(errMsg);
      }
      debug('Every boards are parsed.');
      if (typeof trelloHarvesterCb === 'function') {
        trelloHarvesterCb(err);
      }
    });
  }
