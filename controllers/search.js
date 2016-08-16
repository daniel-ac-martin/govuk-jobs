'use strict';

const HOFStandalone = require('../lib/hof-standalone');
const helpers = require('../lib/helpers');
const fields = require('../fields');
const util = require('util');
const model = require('../models').applicant;
const _ = require('lodash');

class SearchController extends HOFStandalone {
  constructor() {
    super(...arguments);
  }

  successHandler(req, res, callback) {
    const query = _.pick(req.query, _.keys(fields));
    const querystring = helpers.serialize(query);
    const search = req.form.values.search;
    const terms = search.match(/^[0-9]+$/)
      ? { id: search }
      : { name: search };

    model.search(search)
      .then(function resolved(records) {
        res.render('search', {
          count: records && records.length,
          records: records,
          query: query,
          querystring: querystring
        });
      }, function rejected(err) {
        if (err.name === 'NotFoundError') {
          res.render('search', {
            count: 0,
            records: null,
            query: query,
            querystring: querystring
          });
        }

        callback((err instanceof(Error))
          ? err
          : new Error(err), req, res, callback);
      });
    this.emit('complete', req, res);
  }
}

const form = new SearchController({
  fields: require('../fields'),
  template: 'search'
});

module.exports = form.requestHandler();
