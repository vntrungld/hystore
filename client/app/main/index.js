import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';
import MainController from './main.component';

export default angular.module('hystoreApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.pug'),
    controller: MainController,
    controllerAs: 'vm'
  })
  .name;
