'use strict';

export default class DevApplicationController {
  applications: Object[];

  /*@ngInject*/
  constructor(ApplicationResource) {
    this.applications = ApplicationResource.query();
  }

  delete(application) {
    application.$remove();
    this.applications.splice(this.applications.indexOf(application), 1);
  }
}
