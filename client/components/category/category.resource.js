'use strict';

export function CategoryResource($resource) {
  'ngInject';

  return $resource('api/categories/:slug', {
    slug: '@_slug'
  }, {
    changeCategoryContent: { method: 'PUT' }
  });
}

