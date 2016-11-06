'use strict';

import angular from 'angular';
import DevDashboardController from './dashboard.controller';

export default angular.module('hystoreApp.devDashboard', [])
  .controller('DevDashboardController', DevDashboardController)
  .name;
