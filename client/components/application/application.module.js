'use strict';

import angular from 'angular';
import constants from '../../app/app.constants';
import util from '../util/util.module';
import uiRouter from 'angular-ui-router';

import { ApplicationResource } from './application.resource';
import { ApplicationService } from './application.service';
export default angular.module('hystoreApp.application', [util, constants, uiRouter])
  .factory('ApplicationResource', ApplicationResource)
  .factory('Application', ApplicationService)
  .name;
