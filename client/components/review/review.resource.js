'use strict';

export function ReviewResource($resource) {
  'ngInject';

  return $resource('api/:role/reviews/:id', {
    role: '@role',
    id: '@id'
  }, {
    devPatch: {
      method: 'PATCH',
      params: {
        role: 'dev',
        id: '@id'
      }
    }
  });
}


