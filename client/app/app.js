'use strict';

import angular from 'angular';
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';

import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import ngMessages from 'angular-messages';
// import ngValidationMatch from 'angular-validation-match';

import { routeConfig } from './app.config';

import _Auth from '../components/auth/auth.module';
import Category from '../components/category/category.module';
import Application from '../components/application/application.module';
import account from './account';
import admin from './admin';
import dev from './dev';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import constants from './app.constants';
import util from '../components/util/util.module';

import './app.scss';

const mdDataTable = require('angular-material-data-table');

angular.module('hystoreApp', [ngCookies, ngResource, ngSanitize, uiRouter,
  ngMaterial, _Auth, Category, Application, account, admin, dev, navbar,
  footer, main, constants, util, mdDataTable, ngMessages
])
  .config(['$mdAriaProvider', function ($mdAriaProvider) {
      $mdAriaProvider.disableWarnings();
  }])
  .config(routeConfig)
  .run(function($rootScope, $location, Auth) {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in

    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedIn(function(loggedIn) {
        if(next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['hystoreApp'], {
      strictDi: true
    });
  });
