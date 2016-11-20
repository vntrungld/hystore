'use strict';

var app = require('../..');
import request from 'supertest';

var newFile;

describe('File API:', function() {
  describe('GET /api/file', function() {
    var files;

    beforeEach(function(done) {
      request(app)
        .get('/api/file')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          files = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      files.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/file', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/file')
        .send({
          name: 'New File',
          info: 'This is the brand new file!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newFile = res.body;
          done();
        });
    });

    it('should respond with the newly created file', function() {
      newFile.name.should.equal('New File');
      newFile.info.should.equal('This is the brand new file!!!');
    });
  });

  describe('GET /api/file/:id', function() {
    var file;

    beforeEach(function(done) {
      request(app)
        .get(`/api/file/${newFile._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          file = res.body;
          done();
        });
    });

    afterEach(function() {
      file = {};
    });

    it('should respond with the requested file', function() {
      file.name.should.equal('New File');
      file.info.should.equal('This is the brand new file!!!');
    });
  });

  describe('PUT /api/file/:id', function() {
    var updatedFile;

    beforeEach(function(done) {
      request(app)
        .put(`/api/file/${newFile._id}`)
        .send({
          name: 'Updated File',
          info: 'This is the updated file!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedFile = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedFile = {};
    });

    it('should respond with the original file', function() {
      updatedFile.name.should.equal('New File');
      updatedFile.info.should.equal('This is the brand new file!!!');
    });

    it('should respond with the updated file on a subsequent GET', function(done) {
      request(app)
        .get(`/api/file/${newFile._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let file = res.body;

          file.name.should.equal('Updated File');
          file.info.should.equal('This is the updated file!!!');

          done();
        });
    });
  });

  describe('PATCH /api/file/:id', function() {
    var patchedFile;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/file/${newFile._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched File' },
          { op: 'replace', path: '/info', value: 'This is the patched file!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedFile = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedFile = {};
    });

    it('should respond with the patched file', function() {
      patchedFile.name.should.equal('Patched File');
      patchedFile.info.should.equal('This is the patched file!!!');
    });
  });

  describe('DELETE /api/file/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/file/${newFile._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when file does not exist', function(done) {
      request(app)
        .delete(`/api/file/${newFile._id}`)
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
