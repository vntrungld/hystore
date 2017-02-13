'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var categoryCtrlStub = {
  index: 'categoryCtrl.index',
  show: 'categoryCtrl.show',
};

var routerStub = {
  get: sinon.spy(),
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

describe('Category API Router:', function() {
  it('should return an express router instance', function() {
    categoryIndex.should.equal(routerStub);
  });

  describe('GET /api/categories', function() {
    it('should route to category.controller.index', function() {
      routerStub.get
        .withArgs('/', 'categoryCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/categories/:slug', function() {
    it('should route to category.controller.show', function() {
      routerStub.get
        .withArgs('/:slug', 'categoryCtrl.show')
        .should.have.been.calledOnce;
    });
  });
});
