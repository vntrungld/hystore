'use strict';

describe('Service: application', function() {
  // load the service's module
  beforeEach(module('hystoreApp.application'));

  // instantiate service
  var application;
  beforeEach(inject(function(_application_) {
    application = _application_;
  }));

  it('should do something', function() {
    expect(!!application).toBe(true);
  });
});
