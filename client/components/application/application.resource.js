'use strict';

export function ApplicationResource($resource, appConfig) {
  'ngInject';

  return $resource(`${appConfig.cordovaApiUrl}/api/:role/applications/:id`, {
    id: '@_id'
  }, {
    remove: {
      method: 'DELETE',
      params: {
        id: '@_id',
        role: 'dev'
      }
    },
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
        id: '@id'
      }
    },
    adminPatch: {
      method: 'PATCH',
      params: {
        role: 'admin',
        id: '@id'
      }
    }
  });
}
