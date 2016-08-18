'use strict';

const HOFStandalone = require('../lib/hof-standalone');
const helpers = require('../lib/helpers');
const fields = require('../fields');
const applicant = require('../models').applicant;
const _ = require('lodash');

const buildRegExp = (search) => {
  const regex = search
    .split(/\s+/)
    .join('(\\s|\\s.*\\s)');
  return new RegExp(`(^|\\s)${regex}(\\s|$)`, 'i');
};

class SearchController extends HOFStandalone {
  constructor() {
    super(...arguments);
  }

  successHandler(req, res, callback) {
    const query = _.pick(req.query, _.keys(fields));
    const querystring = helpers.serialize(query);
    const search = req.form.values.search;
    const recordsPromise = search.match(/^[0-9]+$/)
      ? applicant.get(Number(search)).then((r) => [r])
      : applicant.searchByProperty('name', buildRegExp(search));

    // Prime HOF to render the form again (including the previous search)
    super._locals(req, res, () => {}); // eslint-disable-line no-underscore-dangle

    recordsPromise
      .then(function resolved(records) {
        if(records.length === 1) {
          const id = records[0].id;

          res.redirect(`/applicant/${id}?${querystring}`);
        } else {
          res.render('search', {
            count: records && records.length,
            records: records,
            query: query,
            querystring: querystring
          });
        }
      }, function rejected(err) {
        if (err instanceof ReferenceError) {
          res.render('search', {
            count: 0,
            records: null,
            query: query,
            querystring: querystring
          });
        } else {
          callback((err instanceof(Error))
            ? err
            : new Error(err), req, res, callback);
        }
      });
    this.emit('complete', req, res);
  }

  get(req, res, callback) {
    applicant.all()
      .then((records) => {
        res.locals.count = records && records.length;
        res.locals.records = records;
        super.get(req, res, callback);
      });
  }
}

const form = new SearchController({
  fields: require('../fields'),
  template: 'search'
});

module.exports = form.requestHandler();
