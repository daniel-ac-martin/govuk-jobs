'use strict';

const url = require('../config').url;

module.exports = function(target) {
  target.internalUrl = function(endpoint) {
    return this.url(`${url}/${endpoint}`.replace(/\/\/+/g, '/'));
  };

  target.clickLink = function(text) {
    this.click(`a=${text}`);
  };
};
