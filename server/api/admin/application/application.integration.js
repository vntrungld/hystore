'use strict';

var app = require('../../..');
import request from 'supertest';

var newApplication;

describe('Application API:', function() {
  describe('GET /api/admin/applications', function() {
    var applications;

    beforeEach(function(done) {
      request(app)
        .get('/api/admin/applications')
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

  describe('GET /api/admin/applications/:id', function() {
    var application;

    beforeEach(function(done) {
      request(app)
        .get(`/api/admin/applications/${newApplication._id}`)
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
      application.info.should.equal('This is the brand new application!!!');
    });
  });

  describe('PATCH /api/admin/applications/:id', function() {
    var patchedApplication;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/admin/applications/${newApplication._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Application' },
          { op: 'replace', path: '/info', value: 'This is the patched application!!!' }
        ])
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
      patchedApplication.name.should.equal('Patched Application');
      patchedApplication.info.should.equal('This is the patched application!!!');
    });
  });
});
