'use strict';

/* eslint no-process-env: 0 */
/* eslint camelcase: 0 */
const config = {
  env: process.env.NODE_ENV,
  name: process.env.npm_package_name,
  port: process.env.PORT || 8080,
  listen_host: process.env.LISTEN_HOST || '0.0.0.0',
  session: {
    secret: process.env.SESSION_SECRET || 'secret'
  }
};

process.title = config.name
  .replace(/[^a-zA-Z]/g, '')
  .substr(0, 6);

module.exports = config;
