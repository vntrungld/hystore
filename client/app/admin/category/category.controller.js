'use strict';

export default class AdminCategoryController {
  categories: Object[];

  /*@ngInject*/
  constructor(CategoryResource) {
    // Use the User $resource to fetch all users
    this.categories = CategoryResource.query();
  }

  delete(category) {
    category.$remove();
    this.categories.splice(this.categories.indexOf(category), 1);
  }
}
