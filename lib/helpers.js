'use strict';

const _ = require('lodash');

module.exports = {
  serialize: function serialize(obj, prefix) {
    let str, p;

    str = [];
    obj = _.pickBy(obj, _.identity);

    for (p in obj) {
      if (obj.hasOwnProperty(p)) {
        let k, v;

        k = prefix ? prefix + '[' + p + ']' : p;
        v = obj[p];

        str.push(typeof v === 'object' ?
          serialize(v, k) :
          encodeURIComponent(k) + '=' + encodeURIComponent(v));
      }
    }

    return str.join('&');
  }
};
