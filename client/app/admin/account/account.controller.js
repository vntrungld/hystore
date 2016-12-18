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
    }, {
      name: 'Delete',
      value: 'delete'
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
  constructor(User) {
    // Use the User $resource to fetch all users
    this.users = User.query();
    this.User = User;
  }

  reload() {
    this.users = this.User.query();
  }

  delete(user) {
    user.$remove();
    this.users.splice(this.users.indexOf(user), 1);
  }
}
