'use strict';

export default class DevApplicationUpdateController {
  update: Object;
  applicationService: Object;

  /*@ngInject*/
  constructor(Application, $state, ApplicationResource, $mdToast) {
    this.applicationService = Application;
    this.state = $state;
    this.mdToast = $mdToast;
    const that = this;

    ApplicationResource.get({
      role: 'dev',
      id: $state.params.id
    }).$promise.then(function(app) {
      that.application = app;
    });
  }

  updateApplication(form) {
    if(form.$valid) {
      const that = this;
      let data = {
        op: 'add',
        path: `/versions/${this.application.versions.length}`,
        value: {
          major: this.update.major,
          minor: this.update.minor,
          maintenance: this.update.maintenance,
          whatsnew: this.update.whatsnew
        },
        archive: this.update.archive
      };
      this.applicationService.update(this.state.params.id, data)
        .then(function() {
          that.mdToast.showSimple('Application Updated');
          that.state.go('dev.application');
        })
        .catch(function(err) {
          that.mdToast.showSimple(`Error: ${err.data.message}`);
        });
    }
  }
}

