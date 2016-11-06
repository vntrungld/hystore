'use strict';

import angular from 'angular';
import DevApplicationController from './application.controller';

export default angular.module('hystoreApp.devApplication', [])
  .controller('DevApplicationController', DevApplicationController)
  .name;

