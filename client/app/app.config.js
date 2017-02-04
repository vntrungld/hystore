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

export function themeConfig($mdThemingProvider) {
  'ngInject';

  $mdThemingProvider.theme('default')
    .primaryPalette('teal');
  $mdThemingProvider.enableBrowserColor();
}
