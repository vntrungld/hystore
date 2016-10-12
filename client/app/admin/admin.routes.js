'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('admin', {
    url: '/admin',
    template: require('./admin.pug'),
    controller: 'AdminController',
    controllerAs: 'admin',
    authenticate: 'admin'
  });
}
