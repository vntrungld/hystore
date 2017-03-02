'use strict';

var app = require('../../..');
var Promise = require('bluebird');
import User from '../../user/user.model';
import Category from '../../category/category.model';
import request from 'supertest';

var newApplication;

describe('Application Dev API:', function() {
  var user;
  var category;
  var token;
  var path = '/home/trungld/Downloads/coc';

  before(function(done) {
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
            info: 'This is the fake category'
          });

          return category.save();
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

  describe('GET /api/dev/applications', function() {
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
        .get('/api/dev/applications')
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

  describe('POST /api/dev/applications', function() {
    beforeEach(function(done) {
      this.timeout(100000); // eslint-disable-line

      request(app)
        .post('/api/dev/applications')
        .set('authorization', `Bearer ${token}`)
        .field('name', 'New Application')
        .attach('icon', `${path}/icon.png`)
        .attach('feature', `${path}/feature.jpg`)
        .attach('screenshots', `${path}/screenshot-1.jpg`)
        .attach('screenshots', `${path}/screenshot-2.jpg`)
        .attach('screenshots', `${path}/screenshot-3.jpg`)
        .field('major', 0)
        .field('minor', 0)
        .field('maintenance', 1)
        .attach('archive', `${path}/coc.zip`)
        .field('description', 'This is the brand new application!!!')
        .field('category', category._id.toString())
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newApplication = res.body;
          done();
        });
    });

    it('should respond with the newly created application', function() {
      newApplication.name.should.equal('New Application');
      newApplication.description.should.equal('This is the brand new application!!!');
      newApplication.currentVersionIndex.should.equal(0);
    });
  });

  describe('GET /api/dev/applications/:id', function() {
    var application;

    beforeEach(function(done) {
      request(app)
        .get(`/api/dev/applications/${newApplication._id}`)
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
      application.name.should.equal('New Application');
      application.description.should.equal('This is the brand new application!!!');
      application.currentVersionIndex.should.equal(0);
    });
  });

  describe('PUT /api/dev/applications/:id', function() {
    var updatedApplication;

    before(function(done) {
      let reqApp = newApplication;
      reqApp.name = 'Updated Application';

      request(app)
        .put(`/api/dev/applications/${newApplication._id}`)
        .set('authorization', `Bearer ${token}`)
        .send(reqApp)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedApplication = res.body;
          done();
        });
    });

    it('should respond with the updated application', function() {
      updatedApplication.name.should.equal('New Application');
    });

    it('should respond with the updated application on a subsequent GET', function(done) {
      request(app)
        .get(`/api/dev/applications/${newApplication._id}`)
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let application = res.body;

          application.name.should.equal('Updated Application');

          done();
        });
    });
  });

  describe('PATCH /api/dev/applications/:id', function() {
    it('should respond with the patched application when use normal request', function(done) {
      request(app)
        .patch(`/api/dev/applications/${newApplication._id}`)
        .set('authorization', `Bearer ${token}`)
        .send([{ op: 'replace', path: '/status', value: 'depublish' }])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          res.body.status.should.equal('depublish');
          done();
        });
    });

    it('should respond with the patched application when use request with file', function(done) {
      this.timeout(100000); // eslint-disable-line
      request(app)
        .patch(`/api/dev/applications/${newApplication._id}`)
        .set('authorization', `Bearer ${token}`)
        .field('op', 'add')
        .field('path', '/versions/1')
        .field('value[minor]', 0)
        .field('value[major]', 0)
        .field('value[maintenance]', 2)
        .field('value[whatsnew]', 'This is present for release note')
        .attach('archive', `${path}/coc.zip`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          res.body.versions.length.should.equal(2);
          done();
        });
    });
  });

  describe('DELETE /api/dev/applications/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/dev/applications/${newApplication._id}`)
        .set('authorization', `Bearer ${token}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when application does not exist', function(done) {
      request(app)
        .delete(`/api/dev/applications/${newApplication._id}`)
        .set('authorization', `Bearer ${token}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
