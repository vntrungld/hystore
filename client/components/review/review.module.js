'use strict';

import angular from 'angular';
import constants from '../../app/app.constants';
import util from '../util/util.module';
import uiRouter from 'angular-ui-router';

import { ReviewResource } from './review.resource';
import { ReviewService } from './review.service';

export default angular.module('hystoreApp.review', [util, constants, uiRouter])
  .factory('ReviewResource', ReviewResource)
  .factory('Review', ReviewService)
  .name;
