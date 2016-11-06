'use strict';

import angular from 'angular';
import ngFileUpload from 'ng-file-upload';
import DevApplicationEditController from './edit.controller';

export default angular.module('hystoreApp.devApplicationEdit', [ngFileUpload])
  .controller('DevApplicationEditController', DevApplicationEditController)
  .name;


