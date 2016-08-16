'use strict';

const _ = require('lodash');

// Add mixins to browser
// /////////////////////////////////////////////////////////////////////
const mixins = [
  require('../mixins/common'),
  require('../mixins/admin'),
  require('../mixins/search'),
  require('../mixins/applicant')
];

before(() => {
  _.each(mixins, (mixin) => {
    mixin(browser);
  });
});
