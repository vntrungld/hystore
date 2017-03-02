'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('main', {
    url: '/?author?search?category',
    template: '<main flex></main>'
  });
}
