'use strict';

describe('Service: application', () => {
  // load the service's module
  beforeEach(module('hystoreApp.application'));

  // instantiate service
  var application;
  beforeEach(inject(_application_ => {
    application = _application_;
  }));

  it('should do something', () => {
    expect(!!application).toBe(true);
  });
});
