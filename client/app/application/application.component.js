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
  constructor($state, ApplicationResource, CategoryResource, Auth, $mdDialog, ReviewResource, Review, $mdToast, User, $cordovaFile, $cordovaFileTransfer, $cordovaZip, $window, $cordovaInAppBrowser) {
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
    this.isInstalled = false;
    this.isUpdated = true;
    this.cordovaFile = $cordovaFile;
    this.cordovaFileTransfer = $cordovaFileTransfer;
    this.cordovaZip = $cordovaZip;
    this.window = $window;
    this.cordovaInAppBrowser = $cordovaInAppBrowser;
    this.appDir = `${cordova.file.applicationStorageDirectory}/apps`;
    this.version = '';
    this.review = {
      for: this.appId,
      star: 1,
      content: ''
    };

    const that = this;

    ApplicationResource.get({ id: this.appId }).$promise
      .then(function(app) {
        that.application = app;
        that.similarApps = ApplicationResource.query({ category: app.category._id });
        that.version = `v${app.major}.${app.minor}.${app.maintenance}`;

        $cordovaFile.checkDir(`${that.appDir}/${app._id}`, '')
          .then(function(result) {
            that.isInstalled = true;
          })
          .catch(function(err) {
            that.isInstalled = false;
          });

        $cordovaFile.checkDir(`${that.appDir}/${app._id}/${that.version}`, '')
          .then(function() {
            that.isUpdated = true;
          })
          .catch(function() {
            that.isUpdated = false;
          });
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
      this.review = {
        for: this.appId,
        star: 1,
        content: ''
      };
    }

    this.getCurrentUser(function(user) {
      that.user = user;

      if(that.findApp() !== -1) {
        that.isSaved = true;
      } else {
        that.isSaved = false;
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

  findApp() {
    const currentAppId = this.appId;

    return this.user.applications.findIndex(function(app) {
      return app._id === currentAppId;
    });
  }

  saveApp() {
    if(this.findApp() === -1) {
      const that = this;
      const data = [{ op: 'add', path: '/applications/-', value: this.appId }];

      this.User.userPatch({ id: this.user._id }, data).$promise
        .then(function() {
          that.user.applications.push(that.application);
        });
    }
  }

  unsaveApp() {
    let appIdx = this.findApp();

    if(appIdx !== -1) {
      const that = this;
      const data = [{ op: 'remove', path: `/applications/${appIdx}` }];

      this.User.userPatch({ id: this.user._id }, data).$promise
        .then(function() {
          that.user.applications.splice(appIdx, 1);
        });
    }
  }

  installApp() {
    const that = this;
    const url = that.application.archive;
    const path = `${this.appDir}/${this.appId}/${this.version}`;
    const trustHost = true;
    const options = {encodeURI: false};

    this.mdToast.showSimple('Downloading...');

    this.cordovaFileTransfer.download(url, `${path}/archive.zip`, options, trustHost)
      .then(function(result) {
        const src = result.fullPath;
        that.cordovaZip.unzip(src, path)
          .then(function() {
            that.mdToast.showSimple('Install complete');
            that.saveApp();
            that.isInstalled = true;
            that.isUpdated = true;
          })
          .catch(function() {
            that.mdToast.showSimple('Install fail');
          });
      })
      .catch(function() {
        that.mdToast.showSimple('Download fail');
      });
  }

  uninstallApp() {
    const that = this;

    this.cordovaFile.removeRecursively(this.appDir, this.application._id)
      .then(function(result) {
        that.mdToast.showSimple('Uninstall complete');
        that.isInstalled = false;
        that.unsaveApp();
      })
      .catch(function(err) {
        that.mdToast.showSimple(`Uninstall fail: ${err}`);
      });
  }

  openApp() {
    const dest = `${this.appDir}/${this.application._id}/${this.version}/index.html`;
    const iabOptions = {
      location: 'yes',
      clearcache: 'no',
      toolbar: 'no'
    };

    this.cordovaInAppBrowser.open(dest, iabOptions);
  }
}
