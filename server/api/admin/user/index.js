'use strict';

var express = require('express');
var controller = require('./user.controller');

var router = express.Router();

router.get('/', controller.index);
router.patch('/:id', controller.patch);
router.put('/:id/profile', controller.changeProfile);
router.delete('/:id', controller.destroy);

module.exports = router;
