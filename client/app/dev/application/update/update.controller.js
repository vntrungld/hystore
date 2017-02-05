'use strict';

export default class DevApplicationUpdateController {
  applicationService: Object;

  /*@ngInject*/
  constructor(Application) {
    this.applicationService = Application;
  }

  updateApplication(form) {
    if(form.$valid) {
      this.applicationService.patch(this.update);
    }
  }
}

