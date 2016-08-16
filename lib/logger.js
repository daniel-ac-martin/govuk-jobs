'use strict';

const winston = require('winston');
const config = require('../config');
const notProd = (config.env === 'development' || config.env === 'acceptance');
const levels = {
  info: 0,
  warn: 1,
  error: 2
};
const colors = {
  info: 'green',
  warn: 'yellow',
  error: 'red'
};

let loggingTransports, exceptionTransports;

loggingTransports = [];
exceptionTransports = [];

loggingTransports.push(
  new (winston.transports.Console)({
    json: (notProd === true) ? false : true,
    timestamp: true,
    colorize: true,
    stringify: function stringify(obj) {
      return JSON.stringify(obj);
    }
  })
);

exceptionTransports.push(
  new (winston.transports.Console)({
    json: (notProd === true) ? false : true,
    timestamp: true,
    colorize: true,
    stringify: function stringify(obj) {
      return JSON.stringify(obj);
    }
  })
);

const transports = {
  levels: levels,
  transports: loggingTransports,
  exceptionHandlers: exceptionTransports,
  exitOnError: true
};

if (notProd) {
  delete transports.exceptionHandlers;
}

const logger = new (winston.Logger)(transports);

winston.addColors(colors);

module.exports = logger;
