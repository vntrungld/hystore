'use strict';

describe('Component: ApplicationComponent', function() {
  // load the controller's module
  beforeEach(module('hystoreApp.userApplication'));

  var ApplicationComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    ApplicationComponent = $componentController('application', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
