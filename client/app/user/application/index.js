'use strict';

import angular from 'angular';
import UserApplicationController from './application.controller';

export default angular.module('hystoreApp.userApplication', [])
  .controller('UserApplicationController', UserApplicationController)
  .name;
