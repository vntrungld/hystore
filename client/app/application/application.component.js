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
  constructor($state, ApplicationResource, CategoryResource, Auth, $mdDialog, ReviewResource, Review, $mdToast, User) {
    this.appId = $state.params.id;
    this.starClasses = ['one', 'two', 'three', 'four', 'five'];
    this.ReviewResource = ReviewResource;
    this.ReviewService = Review;
    this.reviewed = false;
    this.isLoggedIn = Auth.isLoggedInSync; // eslint-disable-line
    this.getCurrentUser = Auth.getCurrentUser;
    this.User = User;
    this.mdDialog = $mdDialog;
    this.reviews = ReviewResource.query({ application: this.appId });
    this.mdToast = $mdToast;
    this.isSaved = false;

    const that = this;

    ApplicationResource.get({ id: this.appId }).$promise
      .then(function(app) {
        that.application = app;
        that.similarApps = ApplicationResource.query({ category: app.category._id });
      });

    if(this.isLoggedIn()) {
      ReviewResource.get({ id: 'me', application: this.appId }).$promise
        .then(function(rev) {
          that.review = rev;
          that.reviewed = true;
        })
        .catch(function() {
          that.review = {
            for: that.appId,
            star: 1,
            content: ''
          };
        });
    } else {
      that.review = {
        for: this.appId,
        star: 1,
        content: ''
      };
    }

    this.getCurrentUser(function(user) {
      that.user = user;

      for(let idx in user.applications) {
        if(user.applications[idx]._id === that.appId) {
          that.appIdx = idx;
          that.isSaved = true;
          break;
        }
      }
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

  createReview() {
    const that = this;

    that.ReviewResource.save({}, that.review).$promise
      .then(() => {
        that.mdToast.showSimple('Review sended!');
        that.cancelReviewDialog();
      })
      .catch(err => {
        that.mdToast.showSimple(err.data.message);
      });
  }

  updateReview() {
    const that = this;
    const data = [
      { op: 'replace', path: '/star', value: that.review.star },
      { op: 'replace', path: '/content', value: that.review.content }
    ];

    that.ReviewResource.patch({ id: that.review._id }, data).$promise
      .then(() => {
        that.mdToast.showSimple('Review updated!');
        that.cancelReviewDialog();
      })
      .catch(err => {
        that.mdToast.showSimple(err.data.message);
      });
  }

  submitReview() {
    if(this.reviewed) {
      return this.updateReview();
    } return this.createReview();
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

  saveApp() {
    const data = [{ op: 'add', path: '/applications/-', value: this.appId }];
    const that = this;

    this.User.userPatch({ id: this.user._id }, data).$promise
      .then(() => {
        that.mdToast.showSimple('Saved');
        that.cancelReviewDialog();
      })
      .catch(err => {
        that.mdToast.showSimple(err.data.message);
      });
  }

  unsaveApp() {
    const data = [{ op: 'remove', path: `/applications/${this.appIdx}` }];
    const that = this;

    this.User.userPatch({ id: this.user._id }, data).$promise
      .then(() => {
        that.mdToast.showSimple('Unsaved');
        that.cancelReviewDialog();
      })
      .catch(err => {
        that.mdToast.showSimple(err.data.message);
      });
  }
}
