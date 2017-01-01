'use strict';

export default class AdminApplicationController {
  applications = [];
  selected = [];
  limitOptions = [10, 50, 100];
  categories = [];
  status = [
    {
      name: 'Publish',
      value: 'publish',
    }, {
      name: 'Unpublish',
      value: 'unpublish',
    }, {
      name: 'Depublish',
      value: 'depublish',
    }, {
      name: 'Block',
      value: 'block',
    },
  ];
  query = {
    order: 'name',
    limit: 10,
    page: 1,
  };
  ApplicationResource;
  User;
  userId;

  /*@ngInject*/
  constructor(ApplicationResource) {
    this.applications = ApplicationResource.query();
  }
}
