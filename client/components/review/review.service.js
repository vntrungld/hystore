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
    },

    /**
     * Update a exist review
     *
     * @param {Object} id - review id
     * @param {Object} change - review object change info
     * @param {Function} callback - function(error, review)
     * @return {Promise}
     */
    devPatch(id, change, callback ? : Function) {
      return ReviewResource.devPatch({
        id
      }, change, function() {
        return safeCb(callback)(null);
      }, function(err) {
        return safeCb(callback)(err);
      })
        .$promise;
    }
  };

  return Review;
}

