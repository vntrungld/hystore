'use strict';

import angular from 'angular';
import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';

import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import ngMessages from 'angular-messages';
import mdDataTable from 'angular-material-data-table';
import angularMoment from 'angular-moment';
import 'angular-carousel';
import 'angular-touch';
import 'trix';
import 'angular-trix';
import angularLoadingBar from 'angular-loading-bar';
import 'ng-img-crop/compile/minified/ng-img-crop';
import 'ng-cordova';

// import ngValidationMatch from 'angular-validation-match';

import { routeConfig, ariaConfig, themeConfig, loadingBarConfig } from './app.config';

import _Auth from '../components/auth/auth.module';
import Category from '../components/category/category.module';
import Application from '../components/application/application.module';
import account from './account';
import admin from './admin';
import dev from './dev';
import user from './user';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main';
import applicationPage from './application';
import constants from './app.constants';
import util from '../components/util/util.module';
import starRating from '../components/star-rating/star-rating.directive';
import review from '../components/review/review.module';

import './app.scss';


angular.module('hystoreApp', [
  ngAnimate,
  ngCookies,
  ngResource,
  ngSanitize,
  uiRouter,
  ngMaterial,
  _Auth,
  Category,
  Application,
  account,
  admin,
  dev,
  user,
  navbar,
  footer,
  main,
  constants,
  util,
  mdDataTable,
  ngMessages,
  applicationPage,
  'angular-carousel',
  starRating,
  review,
  angularMoment,
  'angularTrix',
  angularLoadingBar,
  'ngImgCrop',
  'ngCordova'
])
  .config(routeConfig)
  .config(['$mdAriaProvider', ariaConfig])
  .config(themeConfig)
  .config(['cfpLoadingBarProvider', loadingBarConfig])
  .run(($rootScope, $location, Auth) => {
    'ngInject';

    // Redirect to login if route requires auth and you're not logged in

    $rootScope.$on('$stateChangeStart', (event, next) => { // eslint-disable-line
      Auth.isLoggedIn(loggedIn => {
        if(next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['hystoreApp'], {
      strictDi: true,
    });
  });
