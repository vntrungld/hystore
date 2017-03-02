'use strict';

var app = require('../..');
var Promise = require('bluebird');
import User from '../user/user.model';
import Category from '../category/category.model';
import Application from '../application/application.model';
import request from 'supertest';

var newReview;

describe('Review API:', function() {
  var application;
  var user;
  var token;

  before(function(done) {
    var category;

    return Promise.each([
      function() {
        return User.remove().then(function() {
          user = new User({
            name: 'Fake User',
            email: 'test@example.com',
            password: 'password',
            role: 'dev'
          });

          return user.save();
        });
      },
      function() {
        return Category.remove().then(function() {
          category = new Category({
            name: 'Fake Category',
            info: 'This is fake category'
          });

          return category.save();
        });
      },
      function() {
        return Application.remove().then(function() {
          application = new Application({
            author: user._id,
            name: 'Fake Application',
            icon: 'fake-icon.png',
            feature: 'fake-feature.jpg',
            screenshots: [
              'fake-screenshot-1.jpg',
              'fake-screenshot-2.jpg',
              'fake-screenshot-3.jpg',
            ],
            versions: [
              {
                major: 0,
                minor: 0,
                maintenance: 1,
                archive: 'fake-achive.zip'
              }
            ],
            description: 'This is application description',
            category: category._id
          });

          return application.save();
        });
      }
    ], function(step) {
      return step();
    }).then(function() {
      done();
    });
  });

  after(function(done) {
    return Promise.each([
      function() {
        return Application.remove();
      },
      function() {
        return User.remove();
      },
      function() {
        return Category.remove();
      }
    ], function(step) {
      return step();
    }).then(function() {
      done();
    });
  });

  describe('GET /api/reviews', function() {
    var reviews;

    beforeEach(function(done) {
      request(app)
        .get(`/api/reviews?application=${application._id}`)
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

  describe('POST /api/reviews', function() {
    before(function(done) {
      request(app)
        .post('/auth/local')
        .send({
          email: 'test@example.com',
          password: 'password'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          token = res.body.token;
          done();
        });
    });

    it('should respond with the newly created review', function(done) {
      request(app)
        .post('/api/reviews')
        .set('authorization', `Bearer ${token}`)
        .send({
          for: application._id,
          star: 1,
          content: 'This is the brand new review!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newReview = res.body;
          newReview.star.should.equal(1);
          newReview.content.should.equal('This is the brand new review!!!');
          done();
        });
    });

    it('should respond error with multiple review by one user', function(done) {
      request(app)
        .post('/api/reviews')
        .set('authorization', `Bearer ${token}`)
        .send({
          for: application._id,
          star: 1,
          content: 'Duplicate review'
        })
        .expect(500)
        .end(done);
    });
  });

  describe('PUT /api/reviews/:id', function() {
    var updatedReview;

    beforeEach(function(done) {
      var updateReq = newReview;
      updateReq.star = 2;
      updateReq.content = 'This is the updated review!!!';
      request(app)
        .put(`/api/reviews/${newReview._id}`)
        .set('authorization', `Bearer ${token}`)
        .send(updateReq)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedReview = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedReview = {};
    });

    it('should respond with the updated review', function() {
      updatedReview.star.should.equal(1);
      updatedReview.content.should.equal('This is the brand new review!!!');
    });

    it('should respond with the updated review on a subsequent GET', function(done) {
      request(app)
        .get(`/api/reviews/me?application=${application._id}`)
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let review = res.body;

          review.star.should.equal(2);
          review.content.should.equal('This is the updated review!!!');

          done();
        });
    });
  });

  describe('PATCH /api/reviews/:id', function() {
    var patchedReview;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/reviews/${newReview._id}`)
        .set('authorization', `Bearer ${token}`)
        .send([
          { op: 'replace', path: '/star', value: 1 },
          { op: 'replace', path: '/content', value: 'This is the patched review!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedReview = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedReview = {};
    });

    it('should respond with the patched review', function() {
      patchedReview.star.should.equal(1);
      patchedReview.content.should.equal('This is the patched review!!!');
    });
  });
});
