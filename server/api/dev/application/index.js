'use strict';

var express = require('express');
var controller = require('./application.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/',
  controller.storeToHardDisk,
  controller.fileValidate,
  controller.upload,
  controller.create
);
router.put('/:id', controller.storeToHardDisk, controller.upload, controller.upsert);
router.patch('/:id',
  controller.getSlug,
  controller.storeToHardDisk,
  controller.fileValidate,
  controller.handlePatchObjectRequest,
  controller.handlePatchVersionRequest,
  controller.upload,
  controller.patch
);
router.delete('/:id', controller.destroy);

module.exports = router;
