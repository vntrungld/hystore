'use strict';

var express = require('express');
var controller = require('./application.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:slug', controller.show);
router.post('/', controller.storeToHardDisk, controller.createWithNoUrl, controller.fileValidate, controller.upload, controller.updateUrlAfterCreate);
router.put('/:slug', controller.storeToHardDisk, controller.fileValidate, controller.upload, controller.upsert);
router.patch('/:slug', controller.patch);
router.delete('/:slug', controller.destroy);

module.exports = router;
