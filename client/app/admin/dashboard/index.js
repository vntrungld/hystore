'use strict';

import angular from 'angular';
import AdminDashboardController from './dashboard.controller';

export default angular.module('hystoreApp.adminDashboard', [])
  .controller('AdminDashboardController', AdminDashboardController)
  .name;
