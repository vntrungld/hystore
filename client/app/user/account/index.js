'use strict';

import angular from 'angular';
import UserAccountController from './account.controller';

export default angular.module('hystoreApp.userAccount', [])
  .controller('UserAccountController', UserAccountController)
  .name;

