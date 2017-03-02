'use strict';

export default class MainController {
  applications: Array;
  categories: Array;
  category: Object;

  /*@ngInject*/
  constructor(ApplicationResource, CategoryResource, $state) {
    let options = $state.params;
    this.state = $state;
    this.category = {};
    if($state.params.category) {
      this.category = $state.params.category;
    }

    this.applications = ApplicationResource.query(options);
    this.categories = CategoryResource.query();

  }

  goCategory(id) {
    return this.state.go('main', { category: id });
  }
}
