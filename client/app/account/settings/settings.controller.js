'use strict';
// @flow

type User = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default class SettingsController {
  user: User = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  errors = {
    other: undefined
  };
  message = '';
  Auth;

  /*@ngInject*/
  constructor(Auth, $mdToast, $state) {
    this.Auth = Auth;
    this.mdToast = $mdToast;
    this.state = $state;
  }

  changePassword(form) {
    form.password.$setValidity('mongoose', true);
    if(form.$valid) {
      const that = this;
      this.Auth.changePassword(this.user.oldPassword, this.user.newPassword)
        .then(() => {
          that.mdToast.showSimple('Password successfully changed.');
          that.state.go('main');
        })
        .catch(() => {
          form.password.$setValidity('mongoose', false);
          this.errors.other = 'Incorrect password';
          that.mdToast.showSimple('Fail to change password');
        });
    }
  }
}
