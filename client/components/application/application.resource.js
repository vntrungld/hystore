'use strict';

export function ApplicationResource($resource) {
  'ngInject';

  return $resource('api/applications/:slug', {
    slug: '@slug'
  }, {
    upload: { method: 'POST' }
  });
}


