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
  slug = '';
  applicationService;
  isEdit = true;

  /*@ngInject*/
  constructor($state, CategoryResource, Application, ApplicationResource) {
    this.slug = $state.params.slug;
    this.categories = CategoryResource.query();
    this.applicationService = Application;

    if(this.slug === '') {
      this.isEdit = false;
    }

    if(this.isEdit) {
      this.application = ApplicationResource.get({ slug: this.slug });
    }
  }

  saveApplication(form) {
    if(form.$valid) {
      this.applicationService.upload(this.application);
    }
  }
}
