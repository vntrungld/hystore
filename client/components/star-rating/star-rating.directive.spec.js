'use strict';

describe('Directive: starRating', function() {
  // load the directive's module and view
  beforeEach(module('hystoreApp.starRating'));
  beforeEach(module('components/star-rating/star-rating.pug'));

  var element, scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function($compile) {
    element = angular.element('<star-rating></star-rating>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the starRating directive');
  }));
});
