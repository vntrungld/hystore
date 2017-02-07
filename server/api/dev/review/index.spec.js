'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var reviewCtrlStub = {
  index: 'reviewCtrl.index',
  show: 'reviewCtrl.show',
  patch: 'reviewCtrl.patch'
};

var routerStub = {
  get: sinon.spy(),
  patch: sinon.spy()
};

// require the index with our stubbed out modules
var reviewIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './review.controller': reviewCtrlStub
});

describe('Review Dev API Router:', function() {
  it('should return an express router instance', function() {
    reviewIndex.should.equal(routerStub);
  });

  describe('GET /api/dev/reviews', function() {
    it('should route to review.controller.index', function() {
      routerStub.get
        .withArgs('/', 'reviewCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/dev/reviews/:id', function() {
    it('should route to review.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'reviewCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/dev/reviews/:id', function() {
    it('should route to review.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'reviewCtrl.patch')
        .should.have.been.calledOnce;
    });
  });
});
