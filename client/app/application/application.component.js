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
    this.starClasses = ['one', 'two', 'three', 'four', 'five'];
    const that = this;

    ApplicationResource.get($state.params).$promise.then(app => {
      that.application = app;
      that.isLoggedIn = Auth.isLoggedInSync; // eslint-disable-line
      that.mdDialog = $mdDialog;
      that.ReviewResource = ReviewResource;
      that.ReviewService = Review;
      that.reviews = ReviewResource.query({ application: $state.params.id });
      that.mdToast = $mdToast;
      that.cordovaFile = $cordovaFile;
      that.cordovaFileTransfer = $cordovaFileTransfer;
      that.cordovaZip = $cordovaZip;
      that.window = $window;
      that.cordovaInAppBrowser = $cordovaInAppBrowser;
      that.review = {
        for: app._id,
        star: 1,
        content: '',
      };

      that.similarApps = ApplicationResource.query({ category: app.category._id });
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
