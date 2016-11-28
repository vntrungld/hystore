'use strict';

var express = require('express');
var controller = require('./application.controller');
var File = require('../file/file.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/:slug', controller.show);
router.post('/', auth.hasRole('dev'), File.upload, controller.create);
router.put('/:id', auth.hasRole('dev'), controller.upsert);
router.patch('/:id', auth.hasRole('dev'), controller.patch);
router.delete('/:id', auth.hasRole('dev'), controller.destroy);

module.exports = router;
