'use strict';

describe('List all job applicants', () => {
  describe('When I go to the admin page', () => {
    before(() => {
      browser.goToAdminPage();
    });

    it('Then I should see a list of applicants', () => {
      browser.shouldContainApplicantList();
    });
  });
});
