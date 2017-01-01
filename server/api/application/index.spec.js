'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var applicationCtrlStub = {
  index: 'applicationCtrl.index',
  show: 'applicationCtrl.show',
  create: 'applicationCtrl.create',
  upsert: 'applicationCtrl.upsert',
  patch: 'applicationCtrl.patch',
  destroy: 'applicationCtrl.destroy'
};

var authServiceStub = {
  hasRole(role) {
    return 'authService.hasRole.' + role;
  }
}

var fileCtrlStub = {
  upload: 'fileCtrl.upload'
}

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var applicationIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './application.controller': applicationCtrlStub,
  '../../auth/auth.service': authServiceStub,
  '../file/file.controller': fileCtrlStub
});

describe('Application API Router:', function() {
  it('should return an express router instance', function() {
    applicationIndex.should.equal(routerStub);
  });

  describe('GET /api/applications', function() {
    it('should route to application.controller.index', function() {
      routerStub.get
        .withArgs('/', 'applicationCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/applications/:slug', function() {
    it('should route to application.controller.show', function() {
      routerStub.get
        .withArgs('/:slug', 'applicationCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/applications', function() {
    it('should route to application.controller.create', function() {
      routerStub.post
        .withArgs('/', 'authService.hasRole.dev', 'fileCtrl.upload', 'applicationCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/applications/:slug', function() {
    it('should route to application.controller.upsert', function() {
      routerStub.put
        .withArgs('/:slug', 'authService.hasRole.dev', 'applicationCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/applications/:slug', function() {
    it('should route to application.controller.patch', function() {
      routerStub.patch
        .withArgs('/:slug', 'authService.hasRole.dev', 'applicationCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/applications/:slug', function() {
    it('should route to application.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:slug', 'authService.hasRole.dev', 'applicationCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
