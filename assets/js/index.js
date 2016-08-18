'use strict';

const toolkit = require('hof').toolkit;
const helpers = toolkit.helpers;
const progressiveReveal = toolkit.progressiveReveal;
const formFocus = toolkit.formFocus;

helpers.documentReady(progressiveReveal);
helpers.documentReady(formFocus);
