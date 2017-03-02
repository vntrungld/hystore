'use strict';

export default class AdminAccountController {
  users = [];
  selected = [];
  limitOptions = [10, 50, 100];
  status = [
    {
      name: 'Active',
      value: 'active'
    }, {
      name: 'Inactive',
      value: 'inactive'
    }, {
      name: 'Deactive',
      value: 'deactive'
    }
  ];
  roles = [
    {
      name: 'Administator',
      value: 'admin'
    }, {
      name: 'Developer',
      value: 'dev'
    }, {
      name: 'User',
      value: 'user'
    }
  ];
  query = {
    order: 'name',
    limit: 10,
    page: 1
  };
  User;

  /*@ngInject*/
  constructor(User, $mdToast) {
    this.mdToast = $mdToast;
    // Use the User $resource to fetch all users
    this.users = User.query();
    this.User = User;
  }

  reload() {
    this.users = this.User.query();
  }

  delete(user) {
    const self = this; // eslint-disable-line
    user.$remove()
      .then(function() {
        self.mdToast.showSimple('User deleted');
      })
      .catch(function(err) {
        self.mdToast.showSimple(`Error: ${err.data.message}`);
      });
    this.users.splice(this.users.indexOf(user), 1);
  }

  changeRole(user) {
    const self = this; // eslint-disable-line
    const data = [{
      op: 'replace',
      path: '/role',
      value: user.role
    }];

    this.User.adminPatch({ id: user._id }, data).$promise
      .then(function() {
        self.mdToast.showSimple('User role changed');
      })
      .catch(function(err) {
        self.mdToast.showSimple(`Error: ${err.data.message}`);
      });
  }

  changeStatus(user) {
    const self = this; // eslint-disable-line
    const data = [{
      op: 'replace',
      path: '/status',
      value: user.status
    }];

    this.User.adminPatch({ id: user._id }, data).$promise
      .then(function() {
        self.mdToast.showSimple('User status changed');
      })
      .catch(function(err) {
        self.mdToast.showSimple(`Error: ${err.data.message}`);
      });
  }
}
