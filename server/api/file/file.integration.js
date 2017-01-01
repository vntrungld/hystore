'use strict';

var app = require('../..');
import request from 'supertest';

var newFile;

describe('File API:', function() {
  describe('GET /api/file/:filename', function() {
    var file;

    beforeEach(function(done) {
      request(app)
        .get('/api/file/:filename')
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
});
