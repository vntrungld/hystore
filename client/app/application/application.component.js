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
  constructor($state, ApplicationResource, CategoryResource, Auth, $mdDialog, ReviewResource, Review, $mdToast, $cordovaFile, $cordovaFileTransfer, $cordovaZip, $window, $cordovaInAppBrowser) {
    const appId = $state.params.id;
    const that = this;

    this.starClasses = ['one', 'two', 'three', 'four', 'five'];
    this.ReviewResource = ReviewResource;
    this.ReviewService = Review;
    this.reviewed = false;
    this.isLoggedIn = Auth.isLoggedInSync; // eslint-disable-line
    this.mdDialog = $mdDialog;
    this.reviews = ReviewResource.query({ application: appId });
    this.mdToast = $mdToast;
    this.cordovaFile = $cordovaFile;
    this.cordovaFileTransfer = $cordovaFileTransfer;
    this.cordovaZip = $cordovaZip;
    this.window = $window;
    this.cordovaInAppBrowser = $cordovaInAppBrowser;
    this.review = {
      for: appId,
      star: 1,
      content: ''
    };

    ApplicationResource.get({ id: appId }).$promise
      .then(function(app) {
        that.application = app;
        that.similarApps = ApplicationResource.query({ category: app.category._id });
      });

    if(this.isLoggedIn()) {
      ReviewResource.get({ id: 'me', application: appId }).$promise
        .then(function(rev) {
          that.review = rev;
          that.reviewed = true;
        });
    }
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

  installApp() {
    const that = this;
    const appDir = cordova.file.applicationStorageDirectory;
    const slug = that.application.slug;
    const ver = `v${that.application.major}.${that.application.minor}.${that.application.maintenance}`;
    const url = that.application.archive;
    const path = `${appDir}/apps/${slug}/${ver}`;
    const trustHost = true;
    const options = {encodeURI: false};

    this.mdToast.showSimple('Downloading...');

    this.cordovaFileTransfer.download(url, `${path}/archive.zip`, options, trustHost)
      .then(function(result) {
        const src = result.fullPath;
        that.cordovaZip.unzip(src, path)
          .then(function() {
            that.mdToast.showSimple('Install complete');
            that.cordovaInAppBrowser.open(`${path}/index.html`);
          })
          .catch(function() {
            that.mdToast.showSimple('Install fail');
          });
      })
      .catch(function() {
        that.mdToast.showSimple('Download fail');
      });
  }

  openApp() {
    const appDir = cordova.file.applicationStorageDirectory;
    const slug = this.application.slug;
    const ver = `v${this.application.major}.${this.application.minor}.${this.application.maintenance}`;
    const dest = `${appDir}${slug}/${ver}/index.html`;

    this.cordovaInAppBrowser.open(dest);
  }
}
