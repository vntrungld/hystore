'use strict';
/* eslint prefer-reflect: 0 */

export default class AdminCategoryEditController {
  categories = [];
  options = {
    status: ['active', 'deactive', 'delete']
  };
  errors = {
    other: undefined
  };
  message = '';
  isEdit = true;
  state;
  Category;

  /*@ngInject*/
  constructor($state, CategoryResource, Category, $mdToast) {
    this.Category = Category;
    this.state = $state;
    this.id = $state.params.id;
    this.mdToast = $mdToast;

    this.categories = CategoryResource.query();

    if(this.id === '') {
      this.isEdit = false;
    }

    if(this.isEdit) {
      this.category = CategoryResource.get($state.params);
    }
  }

  createCategory(form) {
    const mdToast = this.mdToast;
    const state = this.state;
    this.Category
      .createCategory(this.category)
      .then(() => {
        mdToast.showSimple('New category created');
        state.go('admin.category');
      })
      .catch(err => {
        form.name.$setValidity('mongoose', false);
        this.errors.other = err.data.message;
        this.message = '';
      });
  }

  changeCategoryContent(form) {
    delete this.category.createdAt;
    delete this.category.updatedAt;
    const mdToast = this.mdToast;
    const state = this.state;

    this.Category
      .changeCategoryContent(this.category)
      .then(() => {
        mdToast.showSimple('Category changed');
        state.go('admin.category');
      })
      .catch(err => {
        form.name.$setValidity('mongoose', false);
        this.errors.other = err.data.message;
        this.message = '';
      });
  }

  saveCategory(form) {
    if(form.$valid) {
      if(this.isEdit) {
        return this.changeCategoryContent(form);
      } return this.createCategory(form);
    }
  }
}
