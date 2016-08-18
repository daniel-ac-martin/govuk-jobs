'use strict';

describe('Searching for an applicant', () => {
  describe('When I go to the search page', () => {
    beforeEach(() => {
      browser.goToSearchPage();
    });

    it('Then I see the search form', () => {
      browser.shouldContainSearchForm();
    });
  });

  describe('When I search for a common name, yielding multiple results', () => {
    before(() => {
      browser.search('John Smith');
    });

    it('Then I should see a list of applicants', () => {
      browser.shouldContainApplicantList();
    });

    it('And I should see the search form with my last search pre-populated', () => {
      browser.shouldContainSearchForm('John Smith');
    });

    describe('And when I click on an applicants\'s name', () => {
      before(() => {
        browser.clickLink('John Smith');
      });

      it('Then I should see the details of the applicant', () => {
        browser.shouldContainDetailsOfApplicant('John Smith');
      });
    });
  });

  describe('When I search for an existing ID, yielding a single result', () => {
    before(() => {
      browser.search('0');
    });

    it('Then I am redirected to the applicant page', () => {
      browser.shouldContainDetailsOfApplicant();
    });
  });

  describe('When I perform a search yielding no results', () => {
    before(() => {
      browser.search('999');
    });

    it('Then I should see a message declaring there are no results', () => {
      browser.shouldSeeNoResults();
    });

    it('And I should see the search form with my last search pre-populated', () => {
      browser.shouldContainSearchForm('999');
    });
  });

  describe('When I attempt an empty search', () => {
    before(() => {
      browser.search('');
    });

    it('Then I should see an error message', () => {
      browser.shouldSeeValidationError('Enter a name or candidate number');
    });

    it('And I should see an empty search form', () => {
      browser.shouldContainSearchForm('');
    });
  });
});
