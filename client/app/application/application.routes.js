'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('application', {
      url: '/application/:id',
      template: '<application flex layout="row"></application>'
    });
}
