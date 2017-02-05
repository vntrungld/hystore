'use strict';

export default class AdminApplicationController {
  applications: Array;
  selected: Array;
  limitOptions: Array;
  categories: Array;
  status: Array;
  query: Object;
  Application: Object;
  ApplicationResource: Object;

  /*@ngInject*/
  constructor(Application, ApplicationResource, $mdToast) {
    this.mdToast = $mdToast;
    this.applications = ApplicationResource.query({ role: 'admin' });
    this.Application = Application;
    this.ApplicationResource = ApplicationResource;
    this.limitOptions = [10, 50, 100];
    this.categories = [];
    this.status = [
      {
        name: 'Publish',
        value: 'publish',
      }, {
        name: 'Unpublish',
        value: 'unpublish',
      }, {
        name: 'Depublish',
        value: 'depublish',
      }, {
        name: 'Block',
        value: 'block',
      },
    ];
    this.query = {
      order: 'name',
      limit: 10,
      page: 1,
    };
  }

  changeStatus(index) {
    const self = this; // eslint-disable-line

    this.applications[index].$adminPatch()
      .then(function() {
        self.mdToast.showSimple('Application changed');
      });
  }

  reload() {
    this.applications = this.ApplicationResource.query({ role: 'admin' });
  }
}
