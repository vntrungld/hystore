'use strict';

describe('Component: UpdateComponent', function() {
  // load the controller's module
  beforeEach(module('hystoreApp.devApplicationUpdate'));

  var UpdateComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    UpdateComponent = $componentController('update', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
