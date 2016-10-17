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
  submitted = false;
  Auth;

  /*@ngInject*/
  constructor(Auth) {
    this.Auth = Auth;
    this.user = Auth.getCurrentUserSync();
  }

  changeProfile(form) {
    this.submitted = true;

    if(form.$valid) {
      this.Auth.changeProfile(this.user)
        .then(() => {
          this.message = 'Profile successfully changed.';
        })
        .catch(() => {
          form.name.$setValidity('mongoose', false);
          this.errors.other = 'Incorrect profile';
          this.message = '';
        });
    }
  }
}
