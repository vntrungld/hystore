'use strict';

export function ApplicationResource($resource) {
  'ngInject';

  return $resource('api/applications/:slug/:controller', {
    slug: '@slug'
  }, {
    upload: { method: 'POST' },
    getReviews: {
      method: 'GET',
      isArray: true,
      params: {
        slug: '@slug',
        controller: 'reviews'
      }
    }
  });
}
