'use strict';

export function routeConfig($urlRouterProvider, $locationProvider) {
  'ngInject';

  $urlRouterProvider.otherwise('/');

  // $locationProvider.html5Mode(true);

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
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

export function cordovaConfig($cordovaInAppBrowserProvider) {
  'ngInject';

  const defaultOptions = {
    location: 'yes',
    clearcache: 'no',
    toolbar: 'yes'
  };

  document.addEventListener('deviceready', function() {
    $cordovaInAppBrowserProvider.setDefaultOptions(defaultOptions);
  }, false);
}

export function loadingBarConfig(cfpLoadingBarProvider) {
  cfpLoadingBarProvider.includeSpinner = false;
}
