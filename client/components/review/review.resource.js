'use strict';

export function ReviewResource($resource, appConfig) {
  'ngInject';

  return $resource(`${appConfig.cordovaApiUrl}/api/:role/reviews/:id`, {
    id: '@_id'
  }, {
    devPatch: {
      method: 'PATCH',
      params: {
        role: 'dev'
      }
    },
    patch: {
      method: 'PATCH'
    }
  });
}


