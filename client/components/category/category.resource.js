'use strict';

export function CategoryResource($resource) {
  'ngInject';

  return $resource('api/categories/:slug/:controller', {
    slug: '@_slug'
  }, {
    changeCategoryContent: { method: 'PUT' },
    getAppsByCat: {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'applications'
      }
    }
  });
}

