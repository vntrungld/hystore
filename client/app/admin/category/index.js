'use strict';

import angular from 'angular';
import AdminCategoryController from './category.controller';

export default angular.module('hystoreApp.adminCategory', [])
  .controller('AdminCategoryController', AdminCategoryController)
  .name;
