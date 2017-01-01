'use strict';

import main from './main.component';

describe('Component: MainComponent', () => {
  beforeEach(angular.mock.module(main));
  beforeEach(angular.mock.module('stateMock'));

  let scope;
  let mainComponent;
  let state;
  let $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function(_$httpBackend_, $http, $componentController, $rootScope, $state,
    socket) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/things')
      .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);

    scope = $rootScope.$new();
    state = $state;
    mainComponent = $componentController('main', {
      $http,
      $scope: scope,
      socket,
    });
  }));

  it('should attach a list of things to the controller', () => {
    mainComponent.$onInit();
    $httpBackend.flush();
    expect(mainComponent.awesomeThings.length)
      .toBe(4);
  });
});
