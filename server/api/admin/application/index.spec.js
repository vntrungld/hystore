'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var applicationCtrlStub = {
  index: 'applicationCtrl.index',
  show: 'applicationCtrl.show',
  patch: 'applicationCtrl.patch',
};

var routerStub = {
  get: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
};

// require the index with our stubbed out modules
var applicationIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './application.controller': applicationCtrlStub
});

describe('Application Admin API Router:', function() {
  it('should return an express router instance', function() {
    applicationIndex.should.equal(routerStub);
  });

  describe('GET /api/admin/applications', function() {
    it('should route to application.controller.index', function() {
      routerStub.get
        .withArgs('/', 'applicationCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/admin/applications/:slug', function() {
    it('should route to application.controller.show', function() {
      routerStub.get
        .withArgs('/:slug', 'applicationCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/admin/applications/:slug', function() {
    it('should route to application.controller.patch', function() {
      routerStub.patch
        .withArgs('/:slug', 'applicationCtrl.patch')
        .should.have.been.calledOnce;
    });
  });
});
