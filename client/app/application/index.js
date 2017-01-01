'use strict';

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './application.routes';
import ApplicationController from './application.component';

export default angular.module('hystoreApp.applicationPage', [uiRouter])
  .config(routing)
  .component('application', {
    template: require('./application.pug'),
    controller: ApplicationController,
    controllerAs: 'vm'
  })
  .name;
