'use strict';
/* eslint no-sync: 0 */
// @flow

type User = {
  name: string;
};

export default class ProfileController {
  user: User = {
    name: ''
  };

  errors = {
    other: undefined
  };
  message = '';
  Auth;

  /*@ngInject*/
  constructor(Auth, $mdToast, $state) {
    this.Auth = Auth;
    this.user = Auth.getCurrentUserSync();
    this.mdToast = $mdToast;
    this.state = $state;
  }

  changeProfile(form) {
    if(form.$valid) {
      const that = this;
      this.Auth.changeProfile(this.user)
        .then(() => {
          that.mdToast.showSimple('Profile successfully changed.');
          that.state.go('main');
        })
        .catch(() => {
          form.name.$setValidity('mongoose', false);
          this.errors.other = 'Incorrect profile';
          that.mdToast.showSimple('Fail to change profile');
        });
    }
  }
}
