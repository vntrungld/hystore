'use strict';

export default class UserAccountController {
  /*@ngInject*/
  constructor(Auth) {
    const that = this;
    Auth.getCurrentUserSync().$promise
      .then(function(user) {
        that.user = user;
      });
  }
}
