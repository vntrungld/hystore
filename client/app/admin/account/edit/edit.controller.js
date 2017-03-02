'use strict';

export default class AdminAccountEditController {
  options = {
    role: ['admin', 'dev', 'user'],
    status: ['active', 'inactive', 'deactive', 'delete']
  };
  errors = {
    other: undefined
  };
  Auth;

  /*@ngInject*/
  constructor($state, User, Auth, $mdToast) {
    this.id = $state.params.id;
    this.state = $state;
    this.user = User.get({ id: this.id });
    this.User = User;
    this.Auth = Auth;
    this.mdToast = $mdToast;
  }

  changeUserProfile(form) {
    if(form.$valid) {
      const mdToast = this.mdToast;
      const state = this.state;
      this.User.changeProfile({
        role: 'admin',
        id: this.id
      }, this.user).$promise
        .then(() => {
          mdToast.showSimple('Profile successfully changed.');
          state.go('admin.account');
        })
        .catch(err => {
          form.name.$setValidity('mongoose', false);
          this.errors.other = err.data.message;
        });
    }
  }
}
