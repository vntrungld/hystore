'use strict';

export default class AdminApplicationController {
  applications = [];

  /*@ngInject*/
  constructor(ApplicationResource) {
    this.applications = ApplicationResource.query();
  }
}
