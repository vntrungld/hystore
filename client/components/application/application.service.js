'use strict';

export function ApplicationService(Util, ApplicationResource, Upload) {
  'ngInject';

  var safeCb = Util.safeCb;
  var upload = Upload.upload;

  var Application = {
    upload(application) {
      return upload({
        url: 'api/applications/',
        arrayKey: '',
        data: application
      });
    }
  };

  return Application;
}
