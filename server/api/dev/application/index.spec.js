'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var applicationCtrlStub = {
  index: 'applicationCtrl.index',
  show: 'applicationCtrl.show',
  storeToHardDisk: 'applicationCtrl.storeToHardDisk',
  fileValidate: 'applicationCtrl.fileValidate',
  upload: 'applicationCtrl.upload',
  create: 'applicationCtrl.create',
  upsert: 'applicationCtrl.upsert',
  getSlug: 'applicationCtrl.getSlug',
  handlePatchObjectRequest: 'applicationCtrl.handlePatchObjectRequest',
  handlePatchVersionRequest: 'applicationCtrl.handlePatchVersionRequest',
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

describe('Application Dev API Router:', function() {
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

  describe('GET /api/dev/applications/:id', function() {
    it('should route to application.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'applicationCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/dev/applications', function() {
    it('should route to application.controller.create', function() {
      routerStub.post
        .withArgs('/', 'applicationCtrl.storeToHardDisk', 'applicationCtrl.fileValidate', 'applicationCtrl.upload', 'applicationCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/dev/applications/:id', function() {
    it('should route to application.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'applicationCtrl.storeToHardDisk', 'applicationCtrl.upload', 'applicationCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/dev/applications/:id', function() {
    it('should route to application.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id',
          'applicationCtrl.getSlug',
          'applicationCtrl.storeToHardDisk',
          'applicationCtrl.fileValidate',
          'applicationCtrl.handlePatchObjectRequest',
          'applicationCtrl.handlePatchVersionRequest',
          'applicationCtrl.upload',
          'applicationCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/dev/applications/:id', function() {
    it('should route to application.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'applicationCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
