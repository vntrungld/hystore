'use strict';

describe('Component: AccountComponent', function() {
  // load the controller's module
  beforeEach(module('hystoreApp.userAccount'));

  var AccountComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    AccountComponent = $componentController('account', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
