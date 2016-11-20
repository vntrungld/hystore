'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var fileCtrlStub = {
  index: 'fileCtrl.index',
  show: 'fileCtrl.show',
  create: 'fileCtrl.create',
  upsert: 'fileCtrl.upsert',
  patch: 'fileCtrl.patch',
  destroy: 'fileCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var fileIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './file.controller': fileCtrlStub
});

describe('File API Router:', function() {
  it('should return an express router instance', function() {
    fileIndex.should.equal(routerStub);
  });

  describe('GET /api/file', function() {
    it('should route to file.controller.index', function() {
      routerStub.get
        .withArgs('/', 'fileCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/file/:id', function() {
    it('should route to file.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'fileCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/file', function() {
    it('should route to file.controller.create', function() {
      routerStub.post
        .withArgs('/', 'fileCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/file/:id', function() {
    it('should route to file.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'fileCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/file/:id', function() {
    it('should route to file.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'fileCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/file/:id', function() {
    it('should route to file.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'fileCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
