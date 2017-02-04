'use strict';

import angular from 'angular';
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';

import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import ngMessages from 'angular-messages';
import mdDataTable from 'angular-material-data-table';

// import ngValidationMatch from 'angular-validation-match';

import { routeConfig, ariaConfig } from './app.config';

import _Auth from '../components/auth/auth.module';
import Category from '../components/category/category.module';
import Application from '../components/application/application.module';
import account from './account';
import admin from './admin';
import dev from './dev';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main';
import applicationPage from './application';
import constants from './app.constants';
import util from '../components/util/util.module';
import starRating from '../components/star-rating/star-rating.directive';
import review from '../components/review/review.module';

import './app.scss';

const ngTouch = require('angular-touch'); // eslint-disable-line
const carousel = require('angular-carousel/dist/angular-carousel'); // eslint-disable-line

angular.module('hystoreApp', [
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
])
  .config(routeConfig)
  .config(['$mdAriaProvider', ariaConfig])
  .run(($rootScope, $location, Auth) => {
    'ngInject';

    // Redirect to login if route requires auth and you're not logged in

    $rootScope.$on('$stateChangeStart', (event, next) => {
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
