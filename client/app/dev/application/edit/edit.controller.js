'use strict';

export default class DevApplicationEditController {
  categories: Array;
  application: Object;
  errors: Object;
  message: String;
  slug: String;
  applicationService: Object;
  isEdit: Boolean;

  /*@ngInject*/
  constructor($state, CategoryResource, Application, ApplicationResource, $mdToast) {
    this.slug = $state.params.slug;
    this.categories = CategoryResource.query();
    this.applicationService = Application;
    this.mdToast = $mdToast;
    this.errors = {
      other: undefined
    };
    this.message = '';
    this.isEdit = true;

    if(this.slug === '') {
      this.isEdit = false;
    }

    if(this.isEdit) {
      this.application = ApplicationResource.get({
        role: 'dev',
        slug: this.slug
      });
    }
  }

  createFilterFor(query) {
    const lowercaseQuery = angular.lowercase(query);

    return function(state) {
      const lowercaseState = angular.lowercase(state.name);

      return lowercaseState.indexOf(lowercaseQuery) === 0;
    };
  }

  querySearch(query) {
    const result = query ? this.categories.filter(this.createFilterFor(query)) : this.categories;

    return result;
  }

  saveApplication(form) {
    if(form.$valid) {
      const self = this;
      this.applicationService.upload(this.application)
        .then(function() {
          self.mdToast.showSimple('Application saved');
        });
    }
  }
}
