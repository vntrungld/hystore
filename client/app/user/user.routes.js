'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('user', {
      url: '/user',
      abstract: true,
      template: require('./user.pug'),
      authenticate: 'user'
    })
      .state('user.account', {
        url: '/account',
        template: require('./account/account.pug'),
        controller: 'UserAccountController',
        controllerAs: 'vm',
        authenticate: 'user'
      })
      .state('user.application', {
        url: '/applications',
        template: require('./application/application.pug'),
        controller: 'UserApplicationController',
        controllerAs: 'vm',
        authenticate: 'user'
      });
}
