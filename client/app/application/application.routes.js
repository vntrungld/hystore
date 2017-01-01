'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('application', {
      url: '/application/:slug',
      template: '<application></application>'
    });
}
