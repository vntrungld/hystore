'use strict';

import angular from 'angular';
import constants from '../../app/app.constants';
import util from '../util/util.module';
import uiRouter from 'angular-ui-router';

import { CategoryResource } from './category.resource';
import { CategoryService } from './category.service';
export default angular.module('hystoreApp.category', [util, constants, uiRouter])
  .factory('CategoryResource', CategoryResource)
  .factory('Category', CategoryService)
  .name;
