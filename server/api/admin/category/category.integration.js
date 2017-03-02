'use strict';

var app = require('../../..');
var Promise = require('bluebird');
import User from '../../user/user.model';
import Category from '../../category/category.model';
import request from 'supertest';

describe('Category Admin API:', function() {
  var user;
  var token;
  var category;

  before(function(done) {
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
        return Category.remove();
      }
    ], function(step) {
      return step();
    }).then(function() {
      return done();
    });
  });

  after(function(done) {
    return Promise.each([
      function() {
        return User.remove();
      },
      function() {
        return Category.remove();
      }
    ], function(step) {
      return step();
    }).then(function() {
      return done();
    });
  });

  describe('POST /api/admin/categories', function() {
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

    it('should respond with the newly created category', function(done) {
      request(app)
        .post('/api/admin/categories')
        .set('authorization', `Bearer ${token}`)
        .send({
          name: 'New Category',
          info: 'This is the brand new category!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }

          category = res.body;
          category.name.should.equal('New Category');
          category.info.should.equal('This is the brand new category!!!');
          done();
        });
    });
  });

  describe('PATCH /api/admin/categories/:id', function() {
    var patchedCategory;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/admin/categories/${category._id}`)
        .set('authorization', `Bearer ${token}`)
        .send([{ op: 'replace', path: '/status', value: 'deactive' }])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedCategory = res.body;
          done();
        });
    });

    it('should respond with the patched category', function() {
      patchedCategory.status.should.equal('deactive');
    });
  });
});

