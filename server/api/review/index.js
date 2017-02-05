'use strict';

const express = require('express');
const controller = require('./review.controller');
const auth = require('../../auth/auth.service');

const router = express.Router();

router.get('/', controller.index);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.upsert);
router.patch('/:id', auth.isAuthenticated(), controller.patch);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
