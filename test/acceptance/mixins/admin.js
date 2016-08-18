'use strict';

module.exports = (target) => {
  target.goToAdminPage = function() {
    this.internalUrl('/');
  };
};
