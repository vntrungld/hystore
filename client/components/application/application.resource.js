'use strict';

export function ApplicationResource($resource) {
  'ngInject';

  return $resource('api/:role/applications/:slug', {
    role: '@role',
    slug: '@slug'
  }, {
    upload: {
      method: 'POST',
      params: {
        role: 'dev'
      }
    },
    devPatch: {
      method: 'PATCH',
      params: {
        role: 'dev',
        slug: '@slug'
      }
    },
    adminPatch: {
      method: 'PATCH',
      params: {
        role: 'admin',
        slug: '@slug'
      }
    }
  });
}
