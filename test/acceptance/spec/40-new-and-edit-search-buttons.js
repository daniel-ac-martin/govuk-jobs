'use strict';

describe('Editing a search', () => {
  describe('When I go directly to an applicant page', () => {
    before(() => {
      browser.goToApplicantPage(0);
    });

    it('Then I can see the "New search" button', () => {
      browser.getText('a.button').should.contain('New search');
    });

    it('And I can NOT see the "Edit search" button', () => {
      browser.getText('a.button').should.not.contain('Edit search');
    });

    describe('When I click the "New search" button', () => {
      before(() => {
        browser.clickLink('New search');
      });

      it('Then I am can see an empty search form', () => {
        browser.shouldContainSearchForm('');
      });
    });
  });

  describe('When I go an applicant page by clicking a search result', () => {
    before(() => {
      browser.search('John Smith');
      browser.clickLink('John Smith');
    });

    it('Then I can see the "New search" button', () => {
      browser.getText('a.button').should.contain('New search');
    });

    it('Then I can see the "Edit search" button', () => {
      browser.getText('a.button').should.contain('Edit search');
    });

    describe('When I click the "Edit search" button', () => {
      before(() => {
        browser.clickLink('Edit search');
      });

      it('Then I am can see a search form, pre-populated with my last search', () => {
        browser.shouldContainSearchForm('John Smith');
      });
    });
  });

  describe('When I go an applicant page via an exact match redirect', () => {
    before(() => {
      browser.search('0');
    });

    it('Then I can see the "New search" button', () => {
      browser.getText('a.button').should.contain('New search');
    });

    it('Then I can see the "Edit search" button', () => {
      browser.getText('a.button').should.contain('Edit search');
    });

    describe('When I click the "Edit search" button', () => {
      before(() => {
        browser.clickLink('Edit search');
      });

      it('Then I am can see a search form, pre-populated with my last search', () => {
        browser.shouldContainSearchForm('0');
      });
    });
  });
});
