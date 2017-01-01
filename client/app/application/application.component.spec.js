'use strict';

describe('Component: ApplicationComponent', () => {
  // load the controller's module
  beforeEach(module('hystoreApp.application'));

  let ApplicationComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject($componentController => {
    ApplicationComponent = $componentController('application', {});
  }));

  it('should ...', () => {
    expect(1).toEqual(1);
  });
});
