'use strict';

export default class DevController {
  reviews: Array;

  /*@ngInject*/
  constructor(ReviewResource) {
    this.reviews = ReviewResource.query({ role: 'dev' });
  }
}
