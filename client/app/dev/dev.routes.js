'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('dev', {
    url: '/dev',
    abstract: true,
    template: require('./dev.pug'),
    authenticate: 'dev'
  })
    .state('dev.dashboard', {
      url: '/dashboard',
      template: require('./dashboard/dashboard.pug'),
      controller: 'DevDashboardController',
      controllerAs: 'vm',
      authenticate: 'dev'
    })
    .state('dev.application', {
      url: '/applications',
      template: require('./application/application.pug'),
      controller: 'DevApplicationController',
      controllerAs: 'vm',
      authenticate: 'dev'
    })
    .state('dev.applicationEdit', {
      url: '/application/:slug',
      template: require('./application/edit/edit.pug'),
      controller: 'DevApplicationEditController',
      controllerAs: 'vm',
      authenticate: 'dev'
    });
}

