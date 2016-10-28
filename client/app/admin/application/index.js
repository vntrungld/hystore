'use strict';

import angular from 'angular';
import AdminApplicationController from './application.controller';

export default angular.module('hystoreApp.adminApplication', [])
  .controller('AdminApplicationController', AdminApplicationController)
  .name;
