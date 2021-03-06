'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('admin', {
    url: '/admin',
    abstract: true,
    template: require('./admin.pug'),
    authenticate: 'admin'
  })
    .state('admin.dashboard', {
      url: '/dashboard',
      template: require('./dashboard/dashboard.pug'),
      controller: 'AdminDashboardController',
      controllerAs: 'vm',
      authenticate: 'admin'
    })
    .state('admin.account', {
      url: '/accounts',
      template: require('./account/account.pug'),
      controller: 'AdminAccountController',
      controllerAs: 'vm',
      authenticate: 'admin'
    })
    .state('admin.accountEdit', {
      url: '/account/:id',
      template: require('./account/edit/edit.pug'),
      controller: 'AdminAccountEditController',
      controllerAs: 'vm',
      authenticate: 'admin'
    })
    .state('admin.category', {
      url: '/categories',
      template: require('./category/category.pug'),
      controller: 'AdminCategoryController',
      controllerAs: 'vm',
      authenticate: 'admin'
    })
    .state('admin.categoryEdit', {
      url: '/category/:id',
      template: require('./category/edit/edit.pug'),
      controller: 'AdminCategoryEditController',
      controllerAs: 'vm',
      authenticate: 'admin'
    })
    .state('admin.application', {
      url: '/applications',
      template: require('./application/application.pug'),
      controller: 'AdminApplicationController',
      controllerAs: 'vm',
      authenticate: 'admin'
    });
}
