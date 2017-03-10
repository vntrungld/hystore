'use strict';

export function UserResource($resource, appConfig) {
  'ngInject';

  return $resource(`${appConfig.cordovaApiUrl}/api/:role/users/:id/:controller`, {
    id: '@_id'
  }, {
    remove: {
      method: 'DELETE',
      params: {
        role: 'admin'
      }
    },
    changePassword: {
      method: 'PUT',
      params: {
        controller: 'password'
      }
    },
    changeProfile: {
      method: 'PUT',
      params: {
        id: '@id',
        role: '@role',
        controller: 'profile'
      }
    },
    query: {
      method: 'GET',
      isArray: true,
      params: {
        role: 'admin'
      }
    },
    get: {
      method: 'GET',
      params: {
        id: 'me'
      }
    },
    adminPatch: {
      method: 'PATCH',
      params: {
        role: 'admin'
      }
    }
  });
}
