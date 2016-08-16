'use strict';

const _ = require('lodash');

let store = [];

const addId = applicant => id => _.extend({id: id}, store[id]);

module.exports = {
  add: (applicant) => new Promise((resolve, reject) => resolve(store.push(applicant))),

  get: (id) => new Promise((resolve, reject) => resolve(addId(store[id])(id))),

  search: (terms) => new Promise((resolve, reject) => {
    const results = store
      .map(addId)
      .filter(_.isSuperset(terms));

    resolve(results)
  }),

  set: (id, applicant) => new Promise((resolve, reject) => resolve(store[id] = applicant))
};
