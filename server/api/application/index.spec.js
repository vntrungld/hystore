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

var routerStub = {
  get: sinon.spy(),
};

// require the index with our stubbed out modules
var applicationIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './application.controller': applicationCtrlStub,
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

  describe('GET /api/applications/:id', function() {
    it('should route to application.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'applicationCtrl.show')
        .should.have.been.calledOnce;
    });
  });
});
