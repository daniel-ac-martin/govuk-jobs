'use strict';

var hof = require('hof');
var HOFBaseController = hof.controllers.base;
var ErrorClass = hof.controllers.error;
// Hack! - PR required on hof-controllers to fix this
var validators = require(
  '../node_modules/hof-controllers/node_modules/hmpo-form-wizard'
).Controller.validators;
// /Hack
var _ = require('lodash');

class StandaloneController extends HOFBaseController {
  constructor() {
    super(...arguments);
  }

  get(req, res, callback) {
    var submitted = _.intersection(
      Object.keys(req.query),
      Object.keys(this.options.fields)
    );

    // Use query params in place of request body
    req.body = req.query;

    // Treat requests with expected query params as form submissions
    return Object.keys(submitted).length
      ? this.post(req, res, callback)
      : super.get(...arguments);
  }

  // Just like the original but instead of redirecting we render
  // immediately
  errorHandler(err, req, res, callback) {
    if (err.type === 'EDIT') {
      this.setErrors(null, req, res);
      super.get(req, res, callback);
    } else if (this.isValidationError(err)) {
      this.setErrors(err, req, res);
      super.get(req, res, callback);
    } else {
      // if the error is not a validation error then throw and let the error handler pick it up
      callback(err);
    }
  }

  // The errors are already on the request object
  getErrors(req) {
    return req.form.errors || {};
  }

  // Just store in memory on the request object
  setErrors(err, req) {
    var errorValues = req.form ? req.form.values : undefined;

    req.form = _.extend({}, req.form, {
      errors: err,
      errorValues: errorValues
    });
  }

  // The values are already on the request object
  getValues(req, res, callback) {
    callback(null, _.extend({}, req.form.values, req.form.errorValues));
  }

  // Just store in memory on the request object
  saveValues(req, res, callback) {
    delete req.form.errorValues;
    callback();
  }

  // Check if we are editing a previous submission
  validate(req, res, callback) {
    return (req.query.edit === undefined)
      ? super.validate(...arguments)
      : callback(new ErrorClass(null, {type: 'EDIT'}, req));
  }
}

StandaloneController.validators = validators;

module.exports = StandaloneController;
