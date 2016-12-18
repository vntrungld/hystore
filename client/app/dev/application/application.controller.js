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

  /*@ngInject*/
  constructor(ApplicationResource, CategoryResource) {
    this.applications = ApplicationResource.query();
    this.categories = CategoryResource.query();
    this.ApplicationResource = ApplicationResource;
  }

  reload() {
    this.applications = this.ApplicationResource.query();
  }

  delete(application) {
    application.$remove();
    this.applications.splice(this.applications.indexOf(application), 1);
  }
}
