'use strict';

export default class AdminAccountEditController {
  options = {
    role: ['admin', 'dev', 'user'],
    status: ['active', 'inactive', 'deactive', 'delete']
  };
  errors = {
    other: undefined
  };
  message = '';
  Auth;

  /*@ngInject*/
  constructor($state, User, Auth) {
    this.id = $state.params.id;
    this.user = User.get({ id: this.id });
    console.log(this.user);
    this.Auth = Auth;
  }

  changeUserProfile(form) {
    if(form.$valid) {
      this.user._id = this.id;
      this.Auth.changeProfile(this.user)
        .then(() => {
          this.message = 'Profile successfully changed.';
        })
        .catch(() => {
          form.name.$setValidity('mongoose', false);
          this.errors.other = 'Some error';
          this.message = '';
        });
    }
  }
}
