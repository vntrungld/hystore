'use strict';

var app = require('../../..');
var Promise = require('bluebird');
import User from '../../user/user.model';
import Category from '../../category/category.model';
import Application from '../../application/application.model';
import request from 'supertest';

describe('Application Admin API:', function() {
  var fakeApp;
  var user;
  var token;

  before(function() {
    var category;

    return Promise.each([
      function() {
        return User.remove().then(function() {
          user = new User({
            name: 'Fake User',
            email: 'test@example.com',
            password: 'password',
            role: 'admin'
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
          fakeApp = new Application({
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

          return fakeApp.save();
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
      }
    ], function(step) {
      return step();
    });
  });


  describe('GET /api/admin/applications', function() {
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
        .get('/api/admin/applications')
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

  describe('GET /api/admin/applications/:id', function() {
    var application;

    beforeEach(function(done) {
      request(app)
        .get(`/api/admin/applications/${fakeApp._id}`)
        .set('authorization', `Bearer ${token}`)
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

  describe('PATCH /api/admin/applications/:id', function() {
    var patchedApplication;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/admin/applications/${fakeApp._id}`)
        .set('authorization', `Bearer ${token}`)
        .send({ status: 'block' })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedApplication = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedApplication = {};
    });

    it('should respond with the patched application', function() {
      patchedApplication.status.should.equal('block');
    });
  });
});
