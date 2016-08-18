'use strict';

module.exports = function(target) {
  target.goToSearchPage = target.goToAdminPage;

  target.search = function(term) {
    this.goToSearchPage();
    this.submitSearchPage(term);
  };

  target.shouldContainSearchForm = function(term) {
    if (term !== undefined) {
      this.getValue('input[name=search]').should.equal(term);
    } else {
      this.element('input[name=search]').should.not.equal(undefined);
    }
  };

  target.submitSearchPage = function(term) {
    this.setValue('input[name="search"]', term);
    this.submitForm('form');
  };

  target.shouldSeeNoResults = function() {
    this.getText('main').should.contain('No records found');
  };

  target.shouldSeeValidationError = function(message) {
    if (message !== undefined) {
      this.getText('.validation-error .error-message').should.contain(message);
    } else {
      this.element('.validation-error').should.not.equal(undefined);
    }
  };
};
