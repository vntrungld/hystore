'use strict';

import angular from 'angular';
import AdminAccountController from './account.controller';

export default angular.module('hystoreApp.adminAccount', [])
  .controller('AdminAccountController', AdminAccountController)
  .name;
