/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';
import * as auth from './auth/auth.service';

export default function(app) {
  // Insert routes below
  app.use('/api/admin/categories', auth.hasRole('admin'), require('./api/admin/category'));
  app.use('/api/admin/applications', auth.hasRole('admin'), require('./api/admin/application'));
  app.use('/api/dev/reviews', auth.hasRole('dev'), require('./api/dev/review'));
  app.use('/api/dev/applications', auth.hasRole('dev'), require('./api/dev/application'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/reviews', require('./api/review'));
  app.use('/api/categories', require('./api/category'));
  app.use('/api/applications', require('./api/application'));

  app.use('/auth', require('./auth').default);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(`${app.get('appPath')}/index.html`));
    });
}
