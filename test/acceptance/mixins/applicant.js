'use strict';

module.exports = function(target) {
  target.goToApplicantPage = function(id) {
    this.internalUrl(`applicant/${id}`);
  };

  target.shouldContainApplicantList = function() {
    const content = this.getText('ul').join();

    content.should.contain('Candidate number');
    content.should.contain('E-mail');
    content.should.contain('Telephone number');
  };

  target.shouldContainDetailsOfApplicant = function(applicant) {
    const title = this.getTitle();
    const content = this.getText('main');

    if(applicant !== undefined) {
      title.should.contain(applicant);
      content.should.contain(applicant);
    }

    content.should.contain('Candidate number');
    content.should.contain('E-mail');
    content.should.contain('Telephone number');
    content.should.contain('Work history');

    this.shouldContainWorkHistory();
  };

  target.shouldContainWorkHistory = function() {
    this.getText('main').should.contain('Work history');
  };
};
