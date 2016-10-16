'use strict';

var app = require('../..');
import request from 'supertest';

var newCategory;

describe('Category API:', function() {
  describe('GET /api/categories', function() {
    var categorys;

    beforeEach(function(done) {
      request(app)
        .get('/api/categories')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          categorys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      categorys.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/categories', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/categories')
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
          newCategory = res.body;
          done();
        });
    });

    it('should respond with the newly created category', function() {
      newCategory.name.should.equal('New Category');
      newCategory.info.should.equal('This is the brand new category!!!');
    });
  });

  describe('GET /api/categories/:id', function() {
    var category;

    beforeEach(function(done) {
      request(app)
        .get(`/api/categories/${newCategory._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          category = res.body;
          done();
        });
    });

    afterEach(function() {
      category = {};
    });

    it('should respond with the requested category', function() {
      category.name.should.equal('New Category');
      category.info.should.equal('This is the brand new category!!!');
    });
  });

  describe('PUT /api/categories/:id', function() {
    var updatedCategory;

    beforeEach(function(done) {
      request(app)
        .put(`/api/categories/${newCategory._id}`)
        .send({
          name: 'Updated Category',
          info: 'This is the updated category!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedCategory = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedCategory = {};
    });

    it('should respond with the original category', function() {
      updatedCategory.name.should.equal('New Category');
      updatedCategory.info.should.equal('This is the brand new category!!!');
    });

    it('should respond with the updated category on a subsequent GET', function(done) {
      request(app)
        .get(`/api/categories/${newCategory._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let category = res.body;

          category.name.should.equal('Updated Category');
          category.info.should.equal('This is the updated category!!!');

          done();
        });
    });
  });

  describe('PATCH /api/categories/:id', function() {
    var patchedCategory;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/categories/${newCategory._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Category' },
          { op: 'replace', path: '/info', value: 'This is the patched category!!!' }
        ])
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

    afterEach(function() {
      patchedCategory = {};
    });

    it('should respond with the patched category', function() {
      patchedCategory.name.should.equal('Patched Category');
      patchedCategory.info.should.equal('This is the patched category!!!');
    });
  });

  describe('DELETE /api/categories/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/categories/${newCategory._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when category does not exist', function(done) {
      request(app)
        .delete(`/api/categories/${newCategory._id}`)
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
