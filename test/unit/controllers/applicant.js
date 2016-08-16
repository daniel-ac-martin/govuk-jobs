'use strict';

const proxyquire = require('proxyquire');
const get = sinon.stub();
const applicant = proxyquire('../../../controllers/applicant', {
  '../models': {
    applicant: {
      get: get
    }
  }
});

describe('controllers/applicant.js', () => {
  it('is a standard middleware', () => {
    (typeof applicant).should.equal('function');
    applicant.should.have.lengthOf(3);
  });

  describe('when called without an \'id\' parameter on the request', () => {
    let callback;

    before(() => {
      const req = {};
      const res = {};

      callback = sinon.stub();

      applicant(req, res, callback);
    });

    it('raises a ReferenceError', () =>
      callback.should.have.been.calledWith(new ReferenceError('The parameter \'id\' was not defined')));
  });

  describe('when called with a non-integer string \'id\' parameter on the request', () => {
    let callback;

    before(() => {
      const req = {id: 'zero'};
      const res = {};

      callback = sinon.stub();

      applicant(req, res, callback);
    });

    it('raises a TypeError', () =>
      callback.should.have.been.calledWith(new TypeError('The parameter \'id\' was not an integer')));
  });

  describe('when called with an \'id\' parameter on the request', () => {
    describe('and the model\'s promise resolves', () => {
      let callback, render, record;

      before(() => {
        const req = {params: {id: '0'}};
        const res = {};

        record = {test: 'test'};
        get.returns(new Promise((resolve) => resolve(record)));

        callback = sinon.stub();
        render = sinon.stub();
        res.render = render;

        applicant(req, res, callback);
      });

      it('does not call the next middleware', () => callback.should.not.have.been.called);
      it('renders the \'applicant\' view', () =>
        render.should.have.been.calledWith('applicant', {record: record, querystring: ''}));
    });

    describe('and the model\'s promise rejects', () => {
      let callback, render, err;

      before(() => {
        const req = {params: {id: '0'}};
        const res = {};

        err = {error: 'error'};
        get.returns(new Promise((resolve, reject) => reject(err)));

        callback = sinon.stub();
        render = sinon.stub();
        res.render = render;

        applicant(req, res, callback);
      });

      it('raises an error', () => callback.should.have.been.calledWith(err));
    });
  });
});
