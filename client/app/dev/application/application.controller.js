'use strict';

export default class DevApplicationController {
  applications = [];
  selected = [];
  limitOptions = [10, 50, 100];
  categories = [];
  status = [
    {
      name: 'Publish',
      value: 'publish'
    }, {
      name: 'Unpublish',
      value: 'unpublish'
    }, {
      name: 'Depublish',
      value: 'depublish'
    }, {
      name: 'Block',
      value: 'block'
    }
  ];
  query = {
    order: 'name',
    limit: 10,
    page: 1
  };
  ApplicationResource;
  User;
  userId;

  /*@ngInject*/
  constructor(ApplicationResource, CategoryResource, User, Auth) {
    Auth.getCurrentUser()
      .then(currentUser => {
        this.userId = currentUser._id;
        this.applications = this.getApplicationList();
      });

    this.categories = CategoryResource.query();
    this.ApplicationResource = ApplicationResource;
    this.User = User;
  }

  getApplicationList() {
    return this.User.getListApp({ id: this.userId });
  }

  reload() {
    this.applications = this.getApplicationList();
  }

  delete(application) {
    application.$remove();
    this.applications.splice(this.applications.indexOf(application), 1);
  }
}
