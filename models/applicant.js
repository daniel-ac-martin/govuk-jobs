'use strict';

const _ = require('lodash');

let store = [];

const addId = applicant => id => _.extend({id: id}, store[id]);

module.exports = {
  add: (applicant) => {
    if (applicant === undefined) {
      throw new ReferenceError;
    }

    return new Promise((resolve, reject) => {
      store.push(applicant);
      resolve();
    });
  },

  all: () => new Promise((resolve, reject) => resolve([...store])),

  empty: () => new Promise((resolve, reject) => {
    store = [];
    resolve();
  }),

  get: (id) => {
    if (id === undefined) {
      throw new ReferenceError;
    } else if (!Number.isInteger(id)) {
      throw new TypeError;
    }

    return new Promise((resolve, reject) => {
      const result = store[id];
      result === undefined
        ? reject(new ReferenceError)
        : resolve(store[id]);
    });
  },

  search: (terms) => {
    if (terms === undefined) {
      throw new ReferenceError;
    }

    return new Promise((resolve, reject) => {
      const results = store
        .filter(_.matches(terms));

      resolve(results)
    });
  },

  set: (id, applicant) => {
    if (id === undefined) {
      throw new ReferenceError;
    } else if (applicant === undefined) {
      throw new ReferenceError;
    } else if (!Number.isInteger(id)) {
      throw new TypeError;
    }

    return new Promise((resolve, reject) => {
      store[id] = applicant;
      resolve();
    });
  }
};
