'use strict';

export default class MainController {
  applications = [];

  /*@ngInject*/
  constructor(ApplicationResource) {
    this.applications = ApplicationResource.query();
  }
}
