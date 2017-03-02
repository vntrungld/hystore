'use strict';

import {Router} from 'express';
import * as controller from './category.controller';

const router = new Router();

router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
