'use strict';

import {Router} from 'express';
import * as controller from './category.controller';

const router = new Router();

router.get('/', controller.index);
router.get('/:slug', controller.show);

module.exports = router;
