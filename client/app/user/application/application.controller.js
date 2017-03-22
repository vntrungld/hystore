'use strict';

export default class UserApplicationController {
  /*@ngInject*/
  constructor(ApplicationResource, Auth) {
    const that = this;
    Auth.getCurrentUserSync().$promise // eslint-disable-line
      .then(function(user) {
        that.applications = user.applications;
      });
  }
}

