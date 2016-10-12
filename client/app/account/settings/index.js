'use strict';

import angular from 'angular';
import SettingsController from './settings.controller';

export default angular.module('hystoreApp.settings', [])
  .controller('SettingsController', SettingsController)
  .name;
