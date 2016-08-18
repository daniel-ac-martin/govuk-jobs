'use strict';

const applicant = require('../models').applicant;
const fields = require('../fields');
const helpers = require('../lib/helpers');
const _ = require('lodash');

module.exports = (req, res, next) => {
  req.params = req.params || {};

  const id = req.params.id;

  if (id === undefined) {
    next(new ReferenceError('The parameter \'id\' was not defined'), req, res);
  } else if (!id.match(/^[0-9]+$/)) {
    next(new TypeError('The parameter \'id\' was not an integer'), req, res);
  } else {
    applicant.get(Number(req.params.id))
      .then((record) => {
          res.render('applicant', {
            record: record,
            querystring: helpers.serialize(_.pick(req.query, _.keys(fields)))
          });
        }, (err) => {
          next(err, req, res);
        });
  }
};
