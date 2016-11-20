'use strict';

export default class DevApplicationEditController {
  categories: Object[];
  application: {
    name: '',
    archive: File,
    icon: File,
    feature: File,
    screenshots: Object[],
    description: '',
    category: '',
    version: ''
  };
  errors = {
    other: undefined
  };
  message = '';
  id = '';
  applicationService;
  isEdit = true;

  /* @ngInject */
  constructor($state, CategoryResource, Application, ApplicationResource) {
    this.id = $state.params.id;
    this.categories = CategoryResource.query();
    this.applicationService = Application;

    if(this.id === '') {
      this.isEdit = false;
    }

    if(this.isEdit) {
      this.application = ApplicationResource.get({ id: this.id });
    }
  }

  saveApplication(form) {
    if(form.$valid) {
      this.applicationService.upload(this.application);
    }
  }
}
