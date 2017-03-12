'use strict';

export default class DevController {
  reviews: Array;

  /*@ngInject*/
  constructor(ReviewResource) {
    const options = {
      role: 'dev',
      status: 'unread'
    };

    this.reviews = ReviewResource.query(options);
  }
}
