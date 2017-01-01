'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var fileCtrlStub = {
  download: 'fileCtrl.download'
};

var routerStub = {
  get: sinon.spy(),
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

  describe('GET /api/file/:filename', function() {
    it('should route to file.controller.download', function() {
      routerStub.get
        .withArgs('/:filename', 'fileCtrl.download')
        .should.have.been.calledOnce;
    });
  });
});
