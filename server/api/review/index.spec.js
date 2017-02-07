'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var reviewCtrlStub = {
  index: 'reviewCtrl.index',
  create: 'reviewCtrl.create',
  upsert: 'reviewCtrl.upsert',
  patch: 'reviewCtrl.patch',
  destroy: 'reviewCtrl.destroy'
};

var authServiceStub = {
  isAuthenticated() {
    return 'authService.isAuthenticated';
  }
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
  './review.controller': reviewCtrlStub,
  '../../auth/auth.service': authServiceStub
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

  describe('POST /api/reviews', function() {
    it('should route to review.controller.create', function() {
      routerStub.post
        .withArgs('/', 'authService.isAuthenticated', 'reviewCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/reviews/:id', function() {
    it('should route to review.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'authService.isAuthenticated', 'reviewCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/reviews/:id', function() {
    it('should route to review.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'authService.isAuthenticated', 'reviewCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/reviews/:id', function() {
    it('should route to review.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'authService.isAuthenticated', 'reviewCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
