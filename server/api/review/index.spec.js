'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var reviewCtrlStub = {
  index: 'reviewCtrl.index',
  show: 'reviewCtrl.show',
  create: 'reviewCtrl.create',
  upsert: 'reviewCtrl.upsert',
  patch: 'reviewCtrl.patch',
  destroy: 'reviewCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
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

describe('Review API Router:', function() {
  it('should return an express router instance', function() {
    reviewIndex.should.equal(routerStub);
  });

  describe('GET /api/reviews', function() {
    it('should route to review.controller.index', function() {
      routerStub.get
        .withArgs('/', 'reviewCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/reviews/:id', function() {
    it('should route to review.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'reviewCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/reviews', function() {
    it('should route to review.controller.create', function() {
      routerStub.post
        .withArgs('/', 'reviewCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/reviews/:id', function() {
    it('should route to review.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'reviewCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/reviews/:id', function() {
    it('should route to review.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'reviewCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/reviews/:id', function() {
    it('should route to review.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'reviewCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
