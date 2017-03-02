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

  changeStatus(review) {
    const mdToast = this.mdToast;
    const data = [{
      op: 'replace',
      path: '/status',
      value: review.status
    }];

    this.ReviewResource.devPatch({ id: review._id }, data).$promise
      .then(function() {
        mdToast.showSimple('Review changed');
      })
      .catch(function(err) {
        mdToast.showSimple(`Error: ${err.data.message}`);
      });
  }
}
