'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var applicationCtrlStub = {
  index: 'applicationCtrl.index',
  show: 'applicationCtrl.show',
  storeToHardDisk: 'applicationCtrl.storeToHardDisk',
  createWithNoUrl: 'applicationCtrl.createWithNoUrl',
  fileValidate: 'applicationCtrl.fileValidate',
  upload: 'applicationCtrl.upload',
  updateUrlAfterCreate: 'applicationCtrl.updateUrlAfterCreate',
  upsert: 'applicationCtrl.upsert',
  patch: 'applicationCtrl.patch',
  destroy: 'applicationCtrl.destroy'
};

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
  './application.controller': applicationCtrlStub
});

describe('Application API Router:', function() {
  it('should return an express router instance', function() {
    applicationIndex.should.equal(routerStub);
  });

  describe('GET /api/dev/applications', function() {
    it('should route to application.controller.index', function() {
      routerStub.get
        .withArgs('/', 'applicationCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/dev/applications/:slug', function() {
    it('should route to application.controller.show', function() {
      routerStub.get
        .withArgs('/:slug', 'applicationCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/dev/applications', function() {
    it('should route to application.controller.create', function() {
      routerStub.post
        .withArgs('/', 'applicationCtrl.storeToHardDisk', 'applicationCtrl.createWithNoUrl', 'applicationCtrl.fileValidate', 'applicationCtrl.upload', 'applicationCtrl.updateUrlAfterCreate')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/dev/applications/:slug', function() {
    it('should route to application.controller.upsert', function() {
      routerStub.put
        .withArgs('/:slug', 'applicationCtrl.storeToHardDisk', 'applicationCtrl.fileValidate', 'applicationCtrl.upload', 'applicationCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/dev/applications/:slug', function() {
    it('should route to application.controller.patch', function() {
      routerStub.patch
        .withArgs('/:slug', 'applicationCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/dev/applications/:slug', function() {
    it('should route to application.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:slug', 'applicationCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
