'use strict';

export default class DevApplicationController {
  applications: Array;
  limitOptions = [10, 50, 100];
  categories: Array;
  status: Array;
  query: Object;
  ApplicationResource: Object;

  /*@ngInject*/
  constructor(ApplicationResource, CategoryResource) {
    this.applications = ApplicationResource.query({ role: 'dev' });
    this.categories = CategoryResource.query();
    this.ApplicationResource = ApplicationResource;
    this.status = [
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
    this.query = {
      order: 'name',
      limit: 10,
      page: 1
    };
  }

  reload() {
    this.applications = this.ApplicationResource.query({ role: 'dev' });
  }

  delete(application) {
    application.$remove({ role: 'dev' });
    this.applications.splice(this.applications.indexOf(application), 1);
  }
}
