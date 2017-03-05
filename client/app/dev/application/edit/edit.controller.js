'use strict';

export default class DevApplicationEditController {
  categories: Array;
  application: Object;
  errors: Object;
  message: String;
  id: String;
  applicationService: Object;
  isEdit: Boolean;
  selected: Object;
  temp: Object;

  /*@ngInject*/
  constructor($state, CategoryResource, Application, ApplicationResource, $mdToast) {
    this.id = $state.params.id;
    this.categories = CategoryResource.query();
    this.application = {};
    this.applicationService = Application;
    this.mdToast = $mdToast;
    this.errors = {
      other: undefined
    };
    this.message = '';
    this.isEdit = true;
    this.selected = {
      icon: false,
      feature: false,
      screenshots: false
    };
    this.temp = {};

    if(this.id === '') {
      this.isEdit = false;
    }

    if(this.isEdit) {
      let that = this;
      ApplicationResource.get({
        role: 'dev',
        id: that.id
      }).$promise.then(function(app) {
        that.application = app;
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

  selected(name) {
    this.selected[name] = true;
  }

  saveApplication(form) {
    if(form.$valid) {
      const mdToast = this.mdToast;
      if(!this.isEdit) {
        this.applicationService.create(this.application)
          .then(function() {
            mdToast.showSimple('Application created');
          })
          .catch(function(err) {
            mdToast.showSimple(`Error: ${err}`);
          });
      } else {
        this.applicationService.edit(this.application)
          .then(function() {
            mdToast.showSimple('Application saved');
          })
          .catch(function(err) {
            mdToast.showSimple(`Error: ${err}`);
          });
      }
    }
  }
}
