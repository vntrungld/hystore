'use strict';

var app = require('../..');
import request from 'supertest';

var newThing;

describe('Thing API:', function() {
  describe('GET /api/things', function() {
    var things;

    beforeEach(function(done) {
      request(app)
        .get('/api/things')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          things = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      things.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/things', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/things')
        .send({
          name: 'New Thing',
          info: 'This is the brand new thing!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newThing = res.body;
          done();
        });
    });

    it('should respond with the newly created thing', function() {
      newThing.name.should.equal('New Thing');
      newThing.info.should.equal('This is the brand new thing!!!');
    });
  });

  describe('GET /api/things/:id', function() {
    var thing;

    beforeEach(function(done) {
      request(app)
        .get(`/api/things/${newThing._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          thing = res.body;
          done();
        });
    });

    afterEach(function() {
      thing = {};
    });

    it('should respond with the requested thing', function() {
      thing.name.should.equal('New Thing');
      thing.info.should.equal('This is the brand new thing!!!');
    });
  });

  describe('PUT /api/things/:id', function() {
    var updatedThing;

    beforeEach(function(done) {
      request(app)
        .put(`/api/things/${newThing._id}`)
        .send({
          name: 'Updated Thing',
          info: 'This is the updated thing!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedThing = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedThing = {};
    });

    it('should respond with the original thing', function() {
      updatedThing.name.should.equal('New Thing');
      updatedThing.info.should.equal('This is the brand new thing!!!');
    });

    it('should respond with the updated thing on a subsequent GET', function(done) {
      request(app)
        .get(`/api/things/${newThing._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let thing = res.body;

          thing.name.should.equal('Updated Thing');
          thing.info.should.equal('This is the updated thing!!!');

          done();
        });
    });
  });

  describe('PATCH /api/things/:id', function() {
    var patchedThing;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/things/${newThing._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Thing' },
          { op: 'replace', path: '/info', value: 'This is the patched thing!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedThing = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedThing = {};
    });

    it('should respond with the patched thing', function() {
      patchedThing.name.should.equal('Patched Thing');
      patchedThing.info.should.equal('This is the patched thing!!!');
    });
  });

  describe('DELETE /api/things/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/things/${newThing._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when thing does not exist', function(done) {
      request(app)
        .delete(`/api/things/${newThing._id}`)
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
