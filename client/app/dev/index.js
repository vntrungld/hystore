'use strict';

import angular from 'angular';

import routing from './dev.routes';
import dev from './dev.controller';
import dashboard from './dashboard';
import application from './application';
import applicationEdit from './application/edit';
import applicationUpdate from './application/update';
import review from './review';

export default angular.module('hystoreApp.dev', [
  'hystoreApp.auth',
  'ui.router',
  dashboard,
  application,
  applicationEdit,
  applicationUpdate,
  review,
])
  .controller('DevController', dev)
  .config(routing)
  .name;
