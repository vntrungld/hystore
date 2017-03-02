'use strict';

export function ReviewResource($resource) {
  'ngInject';

  return $resource('api/:role/reviews/:id', {
    id: '@_id'
  }, {
    devPatch: {
      method: 'PATCH',
      params: {
        role: 'dev',
      }
    }
  });
}


