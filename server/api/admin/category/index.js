'use strict';

import {Router} from 'express';
import * as controller from './category.controller';

const router = new Router();

router.post('/', controller.create);
router.put('/:slug', controller.upsert);
router.patch('/:slug', controller.patch);
router.delete('/:slug', controller.destroy);

module.exports = router;
