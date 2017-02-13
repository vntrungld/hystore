'use strict';

var app = require('../../..');
var Promise = require('bluebird');
import User from '../../user/user.model';
import Category from '../../category/category.model';
import Application from '../../application/application.model';
import Review from '../../review/review.model';
import request from 'supertest';

var newReview;

describe('Review Dev API:', function() {
  var user;
  var token;

  before(function() {
    var fakeApp;
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
            slug: 'fake-category',
            info: 'This is fake category'
          });

          return category.save();
        });
      },
      function() {
        return Application.remove().then(function() {
          fakeApp = new Application({
            author: user._id,
            name: 'Fake Application',
            slug: 'fake-application',
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

          return fakeApp.save();
        });
      },
      function() {
        return Review.remove().then(function() {
          newReview = new Review({
            from: user._id,
            to: user._id,
            for: fakeApp._id,
            star: 1,
            content: 'Fake review'
          });

          return newReview.save();
        });
      }
    ], function(step) {
      return step();
    });
  });

  after(function() {
    return Promise.each([
      function() {
        return Application.remove();
      },
      function() {
        return User.remove();
      },
      function() {
        return Category.remove();
      },
      function() {
        return Review.remove();
      }
    ], function(step) {
      return step();
    });
  });

  describe('GET /api/dev/reviews', function() {
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

    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/dev/reviews')
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          res.body.should.be.instanceOf(Array);
          done();
        });
    });
  });

  describe('PATCH /api/dev/reviews/:id', function() {
    var patchedReview;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/dev/reviews/${newReview._id}`)
        .set('authorization', `Bearer ${token}`)
        .send([{ op: 'replace', path: '/status', value: 'read' }])
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
      patchedReview.status.should.equal('read');
    });
  });
});
