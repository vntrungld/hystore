'use strict';

export default class AdminController {
  mdSidenav: Object;

  /*@ngInject*/
  constructor($mdSidenav) {
    this.mdSidenav = $mdSidenav;
  }
}
