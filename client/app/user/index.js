'use strict';

import angular from 'angular';

import routing from './user.routes';
import account from './account';
import application from './application';

export default angular.module('hystoreApp.user', [
  'hystoreApp.auth',
  'ui.router',
  account,
  application
])
  .config(routing)
  .name;

