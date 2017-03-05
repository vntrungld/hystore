'use strict';

export default class DevApplicationUpdateController {
  update: Object;
  applicationService: Object;

  /*@ngInject*/
  constructor(Application, $state) {
    this.applicationService = Application;
    this.state = $state;
  }

  updateApplication(form) {
    if(form.$valid) {
      let data = {
        op: 'add',
        path: '/versions/1',
        value: {
          major: this.update.major,
          minor: this.update.minor,
          maintenance: this.update.maintenance,
          whatsnew: this.update.whatsnew

        },
        archive: this.update.archive
      };
      this.applicationService.update(this.state.params.id, data);
    }
  }
}

