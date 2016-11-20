'use strict';

export function ApplicationResource($resource) {
  'ngInject';

  return $resource('api/applications/:id', {
    id: '@_id'
  }, {
    upload: { method: 'POST' }
  });
}


