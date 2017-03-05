'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var userCtrlStub = {
  index: 'userCtrl.index',
  destroy: 'userCtrl.destroy',
  patch: 'userCtrl.patch',
  changeProfile: 'userCtrl.changeProfile'
};

var routerStub = {
  get: sinon.spy(),
  patch: sinon.spy(),
  put: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var userIndex = proxyquire('./index', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './user.controller': userCtrlStub,
});

describe('User Admin API Router:', function() {
  it('should return an express router instance', function() {
    userIndex.should.equal(routerStub);
  });

  describe('GET /api/users', function() {
    it('should verify admin role and route to user.controller.index', function() {
      routerStub.get
        .withArgs('/', 'userCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/users/:id', function() {
    it('should verify admin role and route to user.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'userCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/users/:id/profile', function() {
    it('should verify admin role and route to user.controller.changeProfile', function() {
      routerStub.put
        .withArgs('/:id/profile', 'userCtrl.changeProfile')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/users/:id', function() {
    it('should verify admin role and route to user.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'userCtrl.patch')
        .should.have.been.calledOnce;
    });
  });
});

