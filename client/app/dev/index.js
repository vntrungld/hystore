'use strict';

import angular from 'angular';

import routing from './dev.routes';
import dashboard from './dashboard';
import application from './application';
import applicationEdit from './application/edit';
import review from './review';

export default angular.module('hystoreApp.dev', [
  'hystoreApp.auth',
  'ui.router',
  dashboard,
  application,
  applicationEdit,
  review,
])
  .config(routing)
  .name;
