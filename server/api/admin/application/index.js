'use strict';

var express = require('express');
var controller = require('./application.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:slug', controller.show);
router.patch('/:slug', controller.patch);

module.exports = router;
