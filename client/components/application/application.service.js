'use strict';
/* eslint prefer-reflect: 0 */

export function ApplicationService(Util, ApplicationResource, Upload, appConfig) {
  'ngInject';

  const upload = Upload.upload;

  const Application = {
    create(application) {
      application.icon = Upload.dataUrltoBlob(application.icon, 'icon');
      return upload({
        url: `${appConfig.cordovaApiUrl}/api/dev/applications/`,
        arrayKey: '',
        data: application,
        method: 'POST'
      });
    },
    edit(application) {
      delete application.$promise;
      delete application.$resolved;
      return upload({
        url: `${appConfig.cordovaApiUrl}/api/dev/applications/${application._id}`,
        arrayKey: '',
        data: application,
        method: 'PUT'
      });
    },
    update(id, patch) {
      return upload({
        url: `${appConfig.cordovaApiUrl}/api/dev/applications/${id}`,
        arrayKey: '',
        data: patch,
        method: 'PATCH'
      });
    }
  };

  return Application;
}
