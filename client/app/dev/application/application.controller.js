'use strict';

export default class DevApplicationController {
  applications: Array;
  limitOptions = [10, 50, 100];
  categories: Array;
  status: Array;
  query: Object;
  ApplicationResource: Object;

  /*@ngInject*/
  constructor(ApplicationResource, CategoryResource, $mdToast) {
    this.applications = ApplicationResource.query({ role: 'dev' });
    this.categories = CategoryResource.query();
    this.ApplicationResource = ApplicationResource;
    this.mdToast = $mdToast;
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
    const mdToast = this.mdToast;

    application.$remove()
      .then(function() {
        mdToast.showSimple('Application deleted');
      })
      .catch(function(err) {
        mdToast.showSimple(err.data.message);
      });
    this.applications.splice(this.applications.indexOf(application), 1);
  }

  changeStatus(application) {
    const mdToast = this.mdToast;
    const data = [{
      op: 'replace',
      path: '/status',
      value: application.status
    }];

    this.ApplicationResource.devPatch({ id: application._id }, data).$promise
      .then(function() {
        mdToast.showSimple('Application status changed');
      })
      .catch(function(err) {
        mdToast.showSimple(`Error: ${err.data.message}`);
      });
  }

  changeVersion(application) {
    const mdToast = this.mdToast;
    const data = [{
      op: 'replace',
      path: '/currentVersionIndex',
      value: application.currentVersionIndex
    }];

    this.ApplicationResource.devPatch({ id: application._id }, data).$promise
      .then(function() {
        mdToast.showSimple('Application version changed');
      })
      .catch(function(err) {
        mdToast.showSimple(`Error: ${err.data.message}`);
      });
  }
}
