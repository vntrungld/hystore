'use strict';

export function ApplicationService(Util, ApplicationResource, Upload) {
  'ngInject';

  const upload = Upload.upload;

  const Application = {
    create(application) {
      return upload({
        url: 'api/dev/applications/',
        data: application,
        method: 'POST'
      });
    },
    edit(application) {
      delete application.$promise;
      delete application.$resolved;
      return upload({
        url: `api/dev/applications/${application.slug}`,
        data: application,
        method: 'PUT'
      });
    }
  };

  return Application;
}
