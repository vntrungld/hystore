'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('dev', {
    url: '/dev',
    template: require('./dev.pug'),
    controller: 'DevController',
    controllerAs: 'vm',
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
      url: '/application/:id',
      template: require('./application/edit/edit.pug'),
      controller: 'DevApplicationEditController',
      controllerAs: 'vm',
      authenticate: 'dev'
    })
    .state('dev.applicationUpdate', {
      url: '/application/:id/update',
      template: require('./application/update/update.pug'),
      controller: 'DevApplicationUpdateController',
      controllerAs: 'vm',
      authenticate: 'dev'
    })
    .state('dev.review', {
      url: '/reviews',
      template: require('./review/review.pug'),
      controller: 'DevReviewController',
      controllerAs: 'vm',
      authenticate: 'dev'
    });
}

