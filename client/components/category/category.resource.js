'use strict';

export function CategoryResource($resource, appConfig) {
  'ngInject';

  return $resource(`${appConfig.cordovaApiUrl}/api/:role/categories/:id/:controller`, {
    id: '@_id'
  }, {
    save: {
      method: 'POST',
      params: {
        role: 'admin'
      }
    },
    remove: {
      method: 'DELETE',
      params: {
        role: 'admin'
      }
    },
    changeCategoryContent: {
      method: 'PUT',
      params: {
        role: 'admin'
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

