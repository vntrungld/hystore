'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class NavbarComponent {
  menu = [{
    title: 'Home',
    state: 'main'
  }];
  isLoggedIn: Function;
  isAdmin: Function;
  isDev: Function;
  getCurrentUser: Function;
  isCollapsed = true;
  mdSidenav: Object;
  state: Object;
  searchText: String;

  constructor(Auth, $state, $mdSidenav) {
    'ngInject';

    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.isDev = Auth.isDevSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.state = $state;
    this.mdSidenav = $mdSidenav;
  }

  isStateAuth(state) {
    return state == this.state.current.authenticate;
  }

  search() {
    this.state.go('main', { search: this.searchText });
  }
}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.pug'),
    controller: NavbarComponent
  })
  .name;
