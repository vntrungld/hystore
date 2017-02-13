'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var categoryCtrlStub = {
  create: 'categoryCtrl.create',
  upsert: 'categoryCtrl.upsert',
  patch: 'categoryCtrl.patch',
  destroy: 'categoryCtrl.destroy'
};

var routerStub = {
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var categoryIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './category.controller': categoryCtrlStub,
});

describe('Category Admin API Router:', function() {
  it('should return an express router instance', function() {
    categoryIndex.should.equal(routerStub);
  });

  describe('POST /api/admin/categories', function() {
    it('should route to category.controller.create', function() {
      routerStub.post
        .withArgs('/', 'categoryCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/admin/categories/:slug', function() {
    it('should route to category.controller.upsert', function() {
      routerStub.put
        .withArgs('/:slug', 'categoryCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/admin/categories/:slug', function() {
    it('should route to category.controller.patch', function() {
      routerStub.patch
        .withArgs('/:slug', 'categoryCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/admin/categories/:slug', function() {
    it('should route to category.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:slug', 'categoryCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});

