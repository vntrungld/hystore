export default class DevReviewController {
  reviews: Array;
  query: Object;

  /*@ngInject*/
  constructor(Review, ReviewResource, $mdToast) {
    this.ReviewResource = ReviewResource;
    this.Review = Review;
    this.query = {
      order: 'when',
      limit: 10,
      page: 1
    };
    this.limitOptions = [10, 50, 100];
    this.status = [
      {
        name: 'Unread',
        value: 'unread'
      }, {
        name: 'Read',
        value: 'read'
      }
    ];
    this.mdToast = $mdToast;

    this.getReviews();
  }

  getReviews() {
    this.reviews = this.ReviewResource.query({ role: 'dev' });
  }

  changeStatus(idx) {
    const currentReview = this.reviews[idx];
    const self = this; // eslint-disable-line

    this.Review.devPatch(currentReview._id, { status: currentReview.status })
      .then(function(review) {
        self.mdToast.showSimple('Review changed');
        self.reviews[idx] = review;
      });
  }
}
