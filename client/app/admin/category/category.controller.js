'use strict';

export default class AdminCategoryController {
  categories = [];
  selected = [];
  limitOptions = [10, 50, 100];
  status = [
    {
      name: 'Active',
      value: 'active'
    }, {
      name: 'Deactive',
      value: 'deactive'
    }, {
      name: 'Delete',
      value: 'delete'
    }
  ];
  query = {
    order: 'name',
    limit: 10,
    page: 1
  };
  CategoryResource;

  /*@ngInject*/
  constructor(CategoryResource) {
    // Use the User $resource to fetch all users
    this.categories = CategoryResource.query();
    this.CategoryResource = CategoryResource;
  }

  reload() {
    this.categories = this.CategoryResource.query();
  }

  delete(category) {
    category.$remove();
    this.categories.splice(this.categories.indexOf(category), 1);
  }
}
