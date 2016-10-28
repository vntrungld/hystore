'use strict';

export default class AdminCategoryEditController {
  options = {
    status: ['active', 'deactive', 'delete']
  };
  errors = {
    other: undefined
  };
  message = '';
  isEdit = true;
  Category;

  /*@ngInject*/
  constructor($state, CategoryResource, Category) {
    this.Category = Category;
    this.id = $state.params.id;

    if(this.id === '') {
      this.isEdit = false;
    }

    if(this.isEdit) {
      this.category = CategoryResource.get({ id: this.id });
    }
  }

  createCategory(form) {
    this.Category
      .createCategory(this.category)
      .then(() => {
        this.message = 'Category successfully created.';
      })
      .catch(() => {
        form.name.$setValidity('mongoose', false);
        this.errors.other = 'Some error';
        this.message = '';
      });
  }

  changeCategoryContent(form) {
    delete this.category.createdAt;
    delete this.category.updatedAt;
    this.Category
      .changeCategoryContent(this.category)
      .then(() => {
        this.message = 'Category successfully changed.';
      })
      .catch(() => {
        form.name.$setValidity('mongoose', false);
        this.errors.other = 'Some error';
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
