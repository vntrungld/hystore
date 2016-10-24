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
      controllerAs: 'adminDashboard',
      authenticate: 'admin'
    })
    .state('admin.account', {
      url: '/accounts',
      template: require('./account/account.pug'),
      controller: 'AdminAccountController',
      controllerAs: 'adminAccount',
      authenticate: 'admin'
    })
    .state('admin.accountEdit', {
      url: '/account/:id',
      template: require('./account/edit/edit.pug'),
      controller: 'AdminAccountEditController',
      controllerAs: 'adminAccountEdit',
      authenticate: 'admin'
    })
    .state('admin.category', {
      url: '/categories',
      template: require('./category/category.pug'),
      controller: 'AdminCategoryController',
      controllerAs: 'adminCategory',
      authenticate: 'admin'
    })
    .state('admin.categoryEdit', {
      url: '/category/:id',
      template: require('./category/edit/edit.pug'),
      controller: 'AdminCategoryEditController',
      controllerAs: 'adminCategoryEdit',
      authenticate: 'admin'
    });
}
