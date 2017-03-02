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
  starClasses: Array;

  /*@ngInject*/
  constructor($state, ApplicationResource, CategoryResource, Auth, $mdDialog, ReviewResource, Review, $mdToast) {
    this.starClasses = ['one', 'two', 'three', 'four', 'five'];

    ApplicationResource.get($state.params).$promise.then(app => {
      this.application = app;
      this.isLoggedIn = Auth.isLoggedInSync; // eslint-disable-line
      this.mdDialog = $mdDialog;
      this.ReviewResource = ReviewResource;
      this.ReviewService = Review;
      this.reviews = ReviewResource.query({ application: $state.params.id });
      this.mdToast = $mdToast;
      this.review = {
        for: app._id,
        star: 1,
        content: '',
      };

      this.similarApps = ApplicationResource.query({ category: app.category._id });
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

  getTotalStar() {
    let totalStar = 0;
    this.application.stars.forEach(function(star) {
      totalStar += star;
    });

    return totalStar;
  }

  getAverageStar() {
    let totalStar = 0;
    let averageStar = 0;
    const count = this.getTotalStar();

    this.application.stars.forEach(function(star, idx) {
      const starValue = idx + 1;

      totalStar += star * starValue;
    });

    if(count) {
      averageStar = totalStar / count;
    }

    return averageStar.toFixed(1);
  }

  getTopStarType() {
    let max = 0;
    let starType = 0;
    this.application.stars.forEach(function(star, idx) {
      if(star > max) {
        max = star;
        starType = idx;
      }
    });

    return starType;
  }

  getStarPercent(idx) {
    const topIdx = this.getTopStarType();

    return this.application.stars[idx] / this.application.stars[topIdx] * 100;
  }

  getRepeatTime(no) {
    return new Array(no);
  }
}
