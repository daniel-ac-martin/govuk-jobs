'use strict';

const applicant = require('../../../models/applicant');
const _ = require('lodash');

const addId = (object, id) => _.extend({id: id}, object);

describe('models/applicant.js', () => {
  describe('add()', () => {
    it('is a function', () => (typeof applicant.add).should.equal('function'));
    it('takes one argument', () => applicant.add.should.have.lengthOf(1));

    describe('when called without an argument', () => {
      it('throws a ReferenceError', () => expect(applicant.add).to.throw(ReferenceError));
    });

    describe('when called with an object', () => {
      let object, prep, result, probe;

      before(() => {
        object = {fun: 'add'};
        prep = applicant.empty();
        result = prep.then(() => applicant.add(object));
        probe = result.then(() => applicant.all());
      });

      it('returns a promise', () => result.should.be.an.instanceof(Promise));
      it('resolves to nothing', () => result.should.eventually.equal(undefined));
      it('adds the object to the model', () => probe.should.eventually.contain(addId(object, 0)));
    });
  });

  describe('all()', () => {
    it('is a function', () => (typeof applicant.all).should.equal('function'));
    it('takes no arguments', () => applicant.all.should.have.lengthOf(0));

    describe('when called', () => {
      let prep, result, one, two, three;

      before(() => {
        one = {fun: 'all', sub: 'one'};
        two = {fun: 'all', sub: 'two'};
        three = {fun: 'all', sub: 'three'};
        prep = applicant.empty()
          .then(() => applicant.add(one))
          .then(() => applicant.add(two))
          .then(() => applicant.add(three));
        result = prep.then(() => applicant.all());
      });

      it('returns a promise', () => applicant.all().should.be.an.instanceof(Promise));
      it('resolves to an array', () => result.should.eventually.be.an.instanceof(Array));
      it('resolves to an array containing the objects', () =>
        result.should.eventually.eql([
          addId(one, 0),
          addId(two, 1),
          addId(three, 2)
        ])
      );
    });
  });

  describe('empty()', () => {
    it('is a function', () => (typeof applicant.empty).should.equal('function'));
    it('takes no arguments', () => applicant.empty.should.have.lengthOf(0));

    describe('when called', () => {
      let prep, result, probe;

      before(() => {
        prep = applicant.add({fun: 'empty'});
        result = prep.then(() => applicant.empty());
        probe = result.then(() => applicant.all());
      });

      it('returns a promise', () => result.should.be.an.instanceof(Promise));
      it('resolves to nothing', () => result.should.eventually.equal(undefined));
      it('empties the model', () => probe.should.eventually.eql([]));
    });
  });

  describe('get()', () => {
    it('is a function', () => (typeof applicant.get).should.equal('function'));
    it('takes one argument', () => applicant.get.should.have.lengthOf(1));

    describe('when called without an argument', () => {
      it('throws a ReferenceError', () => expect(applicant.get).to.throw(ReferenceError));
    });

    describe('when called with a non-integer', () => {
      it('throws a TypeError', () => expect(() => applicant.get('foo')).to.throw(TypeError));
    });

    describe('when called with an integer', () => {
      let id, object, prep, result;

      before(() => {
        id = 0;
        object = {fun: 'get'};
        prep = applicant.set(id, object);
        result = applicant.get(0);
      });

      it('returns a promise', () => result.should.be.an.instanceof(Promise));

      describe('representing an existant id', () => {
        before(() => {
          result = prep.then(() => applicant.get(id));
        });

        it('resolves to the object (plus id)', () => result.should.eventually.eql(addId(object, id)));
      });

      describe('representing a non-existant id', () => {
        before(() => {
          result = prep.then(() => applicant.get(1));
        });

        it('rejects the promise', () => result.should.be.rejected);
      });
    });
  });

  describe('search()', () => {
    it('is a function', () => (typeof applicant.search).should.equal('function'));
    it('takes one argument', () => applicant.search.should.have.lengthOf(1));

    describe('when called without an argument', () => {
      it('throws a ReferenceError', () => expect(applicant.search).to.throw(ReferenceError));
    });

    describe('when called with an object', () => {
      let findMe, dontFind, prep, result;

      before(() => {
        findMe = {fun: 'search', term: 'findMe'};
        dontFind = {fun: 'search', term: 'dontFind'};
        prep = applicant.empty()
          .then(() => applicant.add(findMe))
          .then(() => applicant.add(dontFind));
        result = applicant.search({});
      });

      it('returns a promise', () => result.should.be.an.instanceof(Promise));

      describe('representing a search for which at least one record matches', () => {
        before(() => {
          result = prep.then(() => applicant.search({term: 'findMe'}));
        });

        it('resolves to an array of results', () => result.should.eventually.be.an.instanceof(Array));
        it('resolves to an array of results containing the matching record', () =>
          result.should.eventually.contain(addId(findMe, 0)));
        it('resolves to an array of results that does not contain non-matching records', () =>
          result.should.eventually.not.contain(addId(dontFind, 1)));
      });

      describe('representing a search for which no records match', () => {
        before(() => {
          result = prep.then(() => applicant.search({term: 'cantFind'}));
        });

        it('resolves to an array of results', () => result.should.eventually.be.an.instanceof(Array));
        it('resolves to an empty array', () => result.should.eventually.eql([]));
      });
    });
  });

  describe('searchByProperty()', () => {
    it('is a function', () => (typeof applicant.searchByProperty).should.equal('function'));
    it('takes two arguments', () => applicant.searchByProperty.should.have.lengthOf(2));

    describe('when called without an argument', () => {
      it('throws a ReferenceError', () => expect(applicant.searchByProperty).to.throw(ReferenceError));
    });

    describe('when called with just one argument', () => {
      it('throws a ReferenceError', () => expect(() => applicant.searchByProperty('foo')).to.throw(ReferenceError));
    });

    describe('when called with two arguments', () => {
      describe('and the second is not a regular expression', () => {
        it('throws a TypeError', () => expect(() => applicant.searchByProperty('foo', {})).to.throw(TypeError));
      });

      describe('and the second is a regular expression', () => {
        let findMe, dontFind, prep, result;

        before(() => {
          findMe = {fun: 'search', term: 'findMe'};
          dontFind = {fun: 'search', term: 'dontFind'};
          prep = applicant.empty()
            .then(() => applicant.add(findMe))
            .then(() => applicant.add(dontFind));
          result = applicant.searchByProperty('term', /a/);
        });

        it('returns a promise', () => result.should.be.an.instanceof(Promise));

        describe('representing a search for which at least one record matches', () => {
          before(() => {
            result = prep.then(() => applicant.searchByProperty('term', /^find/));
          });

          it('resolves to an array of results', () => result.should.eventually.be.an.instanceof(Array));
          it('resolves to an array of results containing the matching record', () =>
            result.should.eventually.contain(addId(findMe, 0)));
          it('resolves to an array of results that does not contain non-matching records', () =>
            result.should.eventually.not.contain(addId(dontFind, 1)));
        });

        describe('representing a search for which no records match', () => {
          before(() => {
            result = prep.then(() => applicant.search('term', /^cantfind$/));
          });

          it('resolves to an array of results', () => result.should.eventually.be.an.instanceof(Array));
          it('resolves to an empty array', () => result.should.eventually.eql([]));
        });
      });
    });
  });

  describe('set()', () => {
    it('is a function', () => (typeof applicant.set).should.equal('function'));
    it('takes two arguments', () => applicant.set.should.have.lengthOf(2));

    describe('when called without any arguments', () => {
      it('throws a ReferenceError', () => expect(applicant.set).to.throw(ReferenceError));
    });

    describe('when called with just one argument', () => {
      it('throws a ReferenceError', () => expect(() => applicant.set(0)).to.throw(ReferenceError));
    });

    describe('when called with two arguments', () => {
      describe('and the first is not an integer', () => {
        it('throws a TypeError', () => expect(() => applicant.set('foo', {})).to.throw(TypeError));
      });

      describe('and the first is an integer', () => {
        let id, object, result, probe;

        before(() => {
          id = 0;
          object = {fun: 'set'};
          result = applicant.set(id, object);
          probe = result.then(() => applicant.get(id));
        });

        it('returns a promise', () => result.should.be.an.instanceof(Promise));
        it('resolves to nothing', () => result.should.eventually.equal(undefined));
        it('sets the element to the new object', () => probe.should.eventually.eql(addId(object, id)));
      });
    });
  });
});
