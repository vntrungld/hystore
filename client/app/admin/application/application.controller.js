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
    const mdToast = this.mdToast;

    this.applications[index].$adminPatch()
      .then(function() {
        mdToast.showSimple('Application changed');
      })
      .catch(function(err) {
        mdToast.showSimple(err.data.message);
      });
  }

  reload() {
    this.applications = this.ApplicationResource.query({ role: 'admin' });
  }

  getVersionText(application) {
    const curVer = application.versions[application.currentVersionIndex];

    return `${curVer.major}.${curVer.minor}.${curVer.maintenance}`;
  }
}
