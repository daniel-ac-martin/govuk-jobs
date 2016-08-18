'use strict';

describe('Viewing the details of an applicant', () => {
  describe('When I go to an applicant page', () => {
    before(() => {
      browser.goToApplicantPage(0);
    });

    it('Then I can see the details of the applicant', () => {
      browser.shouldContainDetailsOfApplicant();
    });

    it('And I can see the applicant\'s work history', () => {
      browser.shouldContainWorkHistory();
    });
  });
});
