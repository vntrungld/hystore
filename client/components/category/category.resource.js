'use strict';

export function CategoryResource($resource) {
  'ngInject';

  return $resource('api/categories/:id', {
    id: '@_id'
  }, {
    changeCategoryContent: { method: 'PATCH' }
  });
}

