'use strict';

export function routeConfig($urlRouterProvider, $locationProvider) {
  'ngInject';

  $urlRouterProvider.otherwise('/');

  $locationProvider.html5Mode(true);

  // $locationProvider.html5Mode({
  //   enabled: true,
  //   requireBase: false
  // });
}

export function ariaConfig($mdAriaProvider) {
  'ngInject';

  $mdAriaProvider.disableWarnings();
}
