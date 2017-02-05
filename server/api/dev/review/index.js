'use strict';

var express = require('express');
var controller = require('./review.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.patch('/:id', controller.patch);

module.exports = router;
