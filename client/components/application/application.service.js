'use strict';

export function ApplicationService(Util, ApplicationResource, Upload) {
  'ngInject';

  const upload = Upload.upload;

  const Application = {
    upload(application) {
      return upload({
        url: 'api/dev/applications/',
        arrayKey: '',
        data: application
      });
    }
  };

  return Application;
}
