'use strict';

var app = require('../..');
import Category from './category.model';
import request from 'supertest';

describe('Category API:', function() {
  var fakeCategory;

  before(function(done) {
    return Category.remove().then(function() {
      fakeCategory = new Category({
        name: 'Fake Category',
        slug: 'fake-category'
      });

      return fakeCategory.save().then(function() {
        done();
      });
    });
  });

  after(function(done) {
    return fakeCategory.remove().then(function() {
      done();
    });
  });

  describe('GET /api/categories', function() {
    var categories;

    beforeEach(function(done) {
      request(app)
        .get('/api/categories')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          categories = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      categories.should.be.instanceOf(Array);
    });
  });

  describe('GET /api/categories/:slug', function() {
    var category;

    beforeEach(function(done) {
      request(app)
        .get(`/api/categories/${fakeCategory.slug}`)
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
      category.name.should.equal('Fake Category');
    });
  });
});
