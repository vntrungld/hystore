'use strict';

var express = require('express');
var controller = require('./application.controller');
var File = require('../file/file.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/:slug', controller.show);
router.post('/', auth.hasRole('dev'), File.upload, controller.create);
router.put('/:slug', auth.hasRole('dev'), controller.upsert);
router.patch('/:slug', auth.hasRole('dev'), controller.patch);
router.delete('/:slug', auth.hasRole('dev'), controller.destroy);

module.exports = router;
