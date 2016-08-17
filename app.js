'use strict';

const config = require('./config');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('./lib/logger');
const churchill = require('churchill');
const hof = require('hof');
const template = hof.template;
const mixins = hof.mixins;
const _ = require('lodash');
const fields = _.cloneDeep(require('./fields/'));
const cookieParser = require('cookie-parser');
const hofTemplatePartials = require('hof-template-partials');

const appName = config.name;
const i18n = hof.i18n({
  path: path.resolve(__dirname, './translations/__lng__/__ns__.json')
});
const app = express();
const publicAssets = '/public';

const model = require('./models').applicant;
model.add({
  name: 'John Smith',
  email: 'john@smith.co.uk',
  telephone: '07792 329 298'
});
model.add({
  name: 'John James Smith',
  email: 'john.james@smith.co.uk',
  telephone: '07182 876 876'
});
model.add({
  name: 'Adam Roberts',
  email: 'adam@roberts.co.uk',
  telephone: '07876 873 234'
});
model.add({
  name: 'Harry Williams',
  email: 'harry@williams.co.uk',
  telephone: '07324 365 432'
});

if (config.env !== 'acceptance') {
  app.use(churchill(logger));
}

app.use(publicAssets, express.static(path.resolve(__dirname, './public')));

app.use((req, res, next) => {
  req.baseUrl = config.siteroot ? config.siteroot + req.baseUrl : req.baseUrl;
  res.locals.assetPath = req.baseUrl + publicAssets;
  res.locals.absBaseUrl = req.baseUrl || '/';
  next();
});

template.setup(app);
app.set('view engine', 'html');
app.set('views', [
  path.resolve(__dirname, './views'),
  hofTemplatePartials.views
]);
app.enable('view cache');
app.use(require('express-partial-templates')(app));
app.engine('html', require('hogan-express-strict'));

app.use(bodyParser.urlencoded({extended: true}));

app.use(hof.middleware.deepTranslate({
  translate: i18n.translate.bind(i18n)
}));
app.use(mixins(fields));

app.use((req, res, next) => {
  res.locals.baseUrl = req.baseUrl;
  next();
});

// Trust proxy for secure cookies
app.set('trust proxy', 1);

const secureCookies = (req, res, next) => {
  const cookie = res.cookie.bind(res);
  res.cookie = (name, value, options) => {
    options = options || {};
    options.secure = req.protocol === 'https';
    options.httpOnly = true;
    options.path = '/';
    cookie(name, value, options);
  };
  next();
};

app.use(cookieParser(config.session.secret));
app.use(secureCookies);

app.use(hof.middleware.cookies());

const routes = require('./routes');

app.use(routes);

app.get('/cookies', (req, res) => res.render('cookies', i18n.translate('cookies')));

app.get('/terms-and-conditions', (req, res) => res.render('terms', i18n.translate('terms')));

// shallow health check
app.get('/healthz/ping', (req, res) => res.send(200));

app.use(hof.middleware.notFound({
  logger: logger,
  translate: i18n.translate.bind(i18n)
}));
app.use(hof.middleware.errors({
  logger: logger,
  translate: i18n.translate.bind(i18n)
}));

const server = require('http').createServer(app);

const listen = () => {
  server.listen(config.port, config.listen_host);
};

server
  .on('listening', () => {
    const l = server.address();
    logger.info(appName + ' listening on ' + l.address + ':' + l.port);
  })
  .on('close', () => {
    logger.info(appName + ' is closing down...');
  })
  .on('error', (e) => {
    switch (e.code) {
      case 'EADDRINUSE':
        logger.warn('Address already in use. Retrying...');
        setTimeout(() => {
          server.close();
          listen();
        }, 3000);
        break;
      default:
        logger.error('Unknown error occurred');
        break;
    }
  });

i18n.on('ready', () => {
  listen();
});

