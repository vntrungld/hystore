'use strict';

import {Router} from 'express';
import * as controller from './category.controller';
import * as auth from '../../auth/auth.service';

const router = new Router();

router.get('/', controller.index);
router.get('/:slug', controller.show);
router.get('/:slug/applications', controller.apps);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:slug', auth.hasRole('admin'), controller.upsert);
router.patch('/:slug', auth.hasRole('admin'), controller.patch);
router.delete('/:slug', auth.hasRole('admin'), controller.destroy);

module.exports = router;
