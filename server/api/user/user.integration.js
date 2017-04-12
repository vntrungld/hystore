'use strict';

import app from '../..';
import User from './user.model';
import request from 'supertest';
import mongoose from 'mongoose';

describe('User API:', function() {
  var token;
  var user;

  // Clear users before testing
  before(function() {
    return User.remove().then(function() {
      user = new User({
        name: 'Fake User',
        email: 'test@example.com',
        password: 'password'
      });

      return user.save();
    });
  });

  // Clear users after testing
  after(function() {
    return User.remove();
  });

  describe('GET /api/users/me', function() {
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

    it('should respond with a user profile when authenticated', function(done) {
      request(app)
        .get('/api/users/me')
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          res.body._id.toString().should.equal(user._id.toString());
          done();
        });
    });

    it('should respond with a 401 when not authenticated', function(done) {
      request(app)
        .get('/api/users/me')
        .expect(401)
        .end(done);
    });
  });

  describe('PATCH /api/users/:id', function() {
    var appId = mongoose.Types.ObjectId();

    before(function(done) {
      request(app)
        .patch(`/api/users/${user._id}`)
        .set('authorization', `Bearer ${token}`)
        .send([{ op: 'add', path: '/applications/-', value: appId }])
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          return done();
        });
    });

    it('should respond with the patched user', function(done) {
      request(app)
        .get('/api/users/me')
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          res.body.applications.length.should.equal(1);
          return done();
        });
    });
  });
});
