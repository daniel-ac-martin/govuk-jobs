'use strict';

const _ = require('lodash');

let store = [];

const addId = (object, id) => _.extend({id: id}, object);

const propertyMatchesRegExp = (property, regexp) => (object) => regexp.test(object[property]);

module.exports = {
  add: (applicant) => {
    if (applicant === undefined) {
      throw new ReferenceError('add(): first argument was not defined');
    }

    return new Promise((resolve) => {
      store.push(applicant);
      resolve();
    });
  },

  all: () => new Promise((resolve) => resolve([...store].map(addId))),

  empty: () => new Promise((resolve) => {
    store = [];
    resolve();
  }),

  get: (id) => {
    if (id === undefined) {
      throw new ReferenceError('get(): first argument was not defined');
    } else if (!Number.isInteger(id)) {
      throw new TypeError('get(): first argument was not an integer');
    }

    return new Promise((resolve, reject) => {
      const result = store[id];

      if (result === undefined) {
        reject(new ReferenceError(`get(): no record found with an id of '${id}'`));
      } else {
        resolve(addId(store[id], id));
      }
    });
  },

  search: (terms) => {
    if (terms === undefined) {
      throw new ReferenceError('search(): first argument was not defined');
    }

    return new Promise((resolve) => {
      const results = store
        .map(addId)
        .filter(_.matches(terms));

      resolve(results);
    });
  },

  searchByProperty: (property, regexp) => {
    if (property === undefined) {
      throw new ReferenceError('searchByProperty(): first argument was not defined');
    } else if (regexp === undefined) {
      throw new ReferenceError('searchByProperty(): second argument was not defined');
    } else if (!(regexp instanceof RegExp)) {
      throw new TypeError('searchByProperty(): second argument was not a RegExp');
    }

    return new Promise((resolve) => {
      const results = store
        .map(addId)
        .filter(propertyMatchesRegExp(property, regexp));

      resolve(results);
    });
  },

  set: (id, applicant) => {
    if (id === undefined) {
      throw new ReferenceError('set(): first argument was not defined');
    } else if (applicant === undefined) {
      throw new ReferenceError('set(): second argument was not defined');
    } else if (!Number.isInteger(id)) {
      throw new TypeError('set(): first argument was not an integer');
    }

    return new Promise((resolve) => {
      store[id] = applicant;
      resolve();
    });
  }
};
