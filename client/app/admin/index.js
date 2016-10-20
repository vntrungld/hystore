'use strict';

import angular from 'angular';

import routing from './admin.routes';
import dashboard from './dashboard';
import account from './account';
import accountEdit from './account/edit';

export default angular.module('hystoreApp.admin', ['hystoreApp.auth', 'ui.router', dashboard, account, accountEdit])
  .config(routing)
  .name;
