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
    }
  ];
  query = {
    order: 'name',
    limit: 10,
    page: 1
  };
  CategoryResource;

  /*@ngInject*/
  constructor(CategoryResource, $mdToast) {
    // Use the User $resource to fetch all users
    this.categories = CategoryResource.query();
    this.CategoryResource = CategoryResource;
    this.mdToast = $mdToast;
  }

  reload() {
    this.categories = this.CategoryResource.query();
  }

  delete(category) {
    const mdToast = this.mdToast;

    category.$remove()
      .then(function() {
        mdToast.showSimple('Category deleted');
      })
      .catch(function(err) {
        mdToast.showSimple(err.data.message);
      });
    this.categories.splice(this.categories.indexOf(category), 1);
  }

  changeStatus(category) {
    const mdToast = this.mdToast;
    const data = [{
      op: 'replace',
      path: '/status',
      value: category.status
    }];

    this.CategoryResource.adminPatch({ id: category._id }, data).$promise
      .then(function() {
        mdToast.showSimple('Category status changed');
      })
      .catch(function(err) {
        mdToast.showSimple(`Error: ${err.data.message}`);
      });
  }

  changeParent(category) {
    const mdToast = this.mdToast;
    const data = [{
      op: 'replace',
      path: '/parent',
      value: category.parent._id
    }];

    this.CategoryResource.adminPatch({ id: category._id }, data).$promise
      .then(function() {
        mdToast.showSimple('Category parent changed');
      })
      .catch(function(err) {
        mdToast.showSimple(`Error: ${err.data.message}`);
      });
  }
}
