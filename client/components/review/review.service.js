'use strict';

export function ReviewService(Util, ReviewResource) {
  'ngInject';

  var safeCb = Util.safeCb;

  var Review = {

    /**
     * Create a new review
     *
     * @param {Object}    review - review info
     * @param {Function}  callback - function(error, review)
     * @return {Promise}
     */
    createReview(review, callback ? : Function) {
      return ReviewResource.save(review,
        () => safeCb(callback)(null, review),
        err => safeCb(callback)(err)
      )
        .$promise;
    }
  };

  return Review;
}

