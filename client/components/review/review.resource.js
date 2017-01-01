'use strict';

export function ReviewResource($resource) {
  'ngInject';

  return $resource('api/reviews');
}


