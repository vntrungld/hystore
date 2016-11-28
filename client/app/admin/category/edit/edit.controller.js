'use strict';

export default class AdminCategoryEditController {
  categories = [];
  options = {
    status: ['active', 'deactive', 'delete']
  };
  errors = {
    other: undefined
  };
  message = '';
  slug = '';
  isEdit = true;
  state;
  Category;

  /*@ngInject*/
  constructor($state, CategoryResource, Category) {
    this.Category = Category;
    this.state = $state;
    this.slug = $state.params.slug;

    this.categories = CategoryResource.query();

    if(this.slug === '') {
      this.isEdit = false;
    }

    if(this.isEdit) {
      this.category = CategoryResource.get({ slug: this.slug });
    }
  }

  createCategory(form) {
    this.Category
      .createCategory(this.category)
      .then(() => {
        this.state.go('admin.category');
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
        this.state.go('admin.category');
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
