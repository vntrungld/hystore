'use strict';

var app = require('../..');
var Promise = require('bluebird');
import User from '../user/user.model';
import Category from '../category/category.model';
import Application from './application.model';
import request from 'supertest';

describe('Application API:', function() {
  var fakeApp;

  before(function(done) {
    var user;
    var category;

    return Promise.each([
      function() {
        User.remove().then(function() {
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
        Category.remove().then(function() {
          category = new Category({
            name: 'Fake Category',
            slug: 'fake-category',
            info: 'This is fake category'
          });

          return category.save();
        });
      },
      function() {
        Application.remove().then(function() {
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

  describe('GET /api/applications', function() {
    var applications;

    beforeEach(function(done) {
      request(app)
        .get('/api/applications')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          applications = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      applications.should.be.instanceOf(Array);
    });
  });

  describe('GET /api/applications/:slug', function() {
    var application;

    beforeEach(function(done) {
      request(app)
        .get(`/api/applications/${fakeApp.slug}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          application = res.body;
          done();
        });
    });

    afterEach(function() {
      application = {};
    });

    it('should respond with the requested application', function() {
      application.name.should.equal('Fake Application');
    });
  });
});
