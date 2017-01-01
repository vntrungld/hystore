import angular from 'angular';
import DevReviewController from './review.controller';

export default angular.module('hystoreApp.devReview', [])
  .controller('DevReviewController', DevReviewController)
  .name;
