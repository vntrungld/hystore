'use strict';

export function authInterceptor($rootScope, $q, $cookies, $injector, Util, $window) {
  'ngInject';

  var state;
  return {
    // Add authorization token to headers
    request(config) {
      config.headers = config.headers || {};
      if($cookies.get('token') && Util.isSameOrigin(config.url)) {
        config.headers.Authorization = `Bearer ${$cookies.get('token')}`;
      } else if($window.localStorage.getItem('token')) {
        config.headers.Authorization = `Bearer ${$window.localStorage.getItem('token')}`;
      }
      return config;
    },

    // Intercept 401s and redirect you to login
    responseError(response) {
      if(response.status === 401) {
        (state || (state = $injector.get('$state')))
        .go('login');
        // remove any stale tokens
        $cookies.remove('token');
        $window.localStorage.removeItem('token');
      }
      return $q.reject(response);
    }
  };
}
