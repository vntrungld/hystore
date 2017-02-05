'use strict';

var app = require('../../..');
import request from 'supertest';

var newReview;

describe('Review API:', function() {
  describe('GET /api/dev/reviews', function() {
    var reviews;

    beforeEach(function(done) {
      request(app)
        .get('/api/dev/reviews')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          reviews = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      reviews.should.be.instanceOf(Array);
    });
  });

  describe('GET /api/dev/reviews/:id', function() {
    var review;

    beforeEach(function(done) {
      request(app)
        .get(`/api/dev/reviews/${newReview._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          review = res.body;
          done();
        });
    });

    afterEach(function() {
      review = {};
    });

    it('should respond with the requested review', function() {
      review.name.should.equal('New Review');
      review.info.should.equal('This is the brand new review!!!');
    });
  });
});
