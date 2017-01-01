'use strict';

export default class ApplicationComponent {
  application: Object;
  similarApps: Array;
  isLoggedIn: Function;
  mdDialog: Object;
  showReviewDialog: Function;
  textRate: String;
  ReviewResource: Object;
  reviews: Array;
  ReviewService: Object;
  mdToast: Object;
  review: Object;

  /*@ngInject*/
  constructor($state, ApplicationResource, CategoryResource, Auth, $mdDialog, ReviewResource, Review, $mdToast) {
    ApplicationResource.get({ slug: $state.params.slug }).$promise.then(app => {
      this.application = app;
      this.isLoggedIn = Auth.isLoggedInSync; // eslint-disable-line
      this.mdDialog = $mdDialog;
      this.ReviewResource = ReviewResource;
      this.ReviewService = Review;
      this.reviews = ApplicationResource.getReviews({ slug: $state.params.slug });
      this.mdToast = $mdToast;
      this.review = {
        for: app.slug,
        star: 1,
        content: '',
      };

      CategoryResource.getAppsByCat({ slug: app.category._id }).$promise.then(apps => {
        this.similarApps = apps;
      });
    });
  }

  showReviewDialog(ev) {
    this.mdDialog.show({
      controller: ApplicationComponent,
      controllerAs: 'vm',
      template: require('../../components/review/review.pug'),
      parent: angular.element(document.body), // eslint-disable-line
      targetEvent: ev,
      fullscreen: true,
    });
  }

  cancelReviewDialog() {
    this.mdDialog.cancel();
  }

  submitReview() {
    this.ReviewService
      .createReview(this.review)
      .then(() => {
        this.mdToast.showSimple('Review sended!');
        this.cancelReviewDialog();
      })
      .catch(err => {
        this.mdToast.showSimple(err.data.message);
      });
  }

  getAverageStar(stars) {
    let totalStar = 0;
    let count = 0;
    let averageStar = 0;

    for(let i = 0; i < stars.lenth; i += 1) {
      const starValue = i + 1;
      const totalStarEachValue = stars[i];

      count += totalStarEachValue;
      totalStar += totalStarEachValue * starValue;
    }

    if(count) {
      averageStar = totalStar / count;
    }

    return averageStar;
  }
}
