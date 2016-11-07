/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Thing from '../api/thing/thing.model';
import User from '../api/user/user.model';
import Category from '../api/category/category.model';

Thing.find({}).remove()
  .then(() => {
    Thing.create({
      name: 'Development Tools',
      info: 'Integration with popular tools such as Webpack, Gulp, Babel, TypeScript, Karma, '
            + 'Mocha, ESLint, Node Inspector, Livereload, Protractor, Pug, '
            + 'Stylus, Sass, and Less.'
    }, {
      name: 'Server and Client integration',
      info: 'Built with a powerful and fun stack: MongoDB, Express, '
            + 'AngularJS, and Node.'
    }, {
      name: 'Smart Build System',
      info: 'Build system ignores `spec` files, allowing you to keep '
            + 'tests alongside code. Automatic injection of scripts and '
            + 'styles into your index.html'
    }, {
      name: 'Modular Structure',
      info: 'Best practice client and server structures allow for more '
            + 'code reusability and maximum scalability'
    }, {
      name: 'Optimized Build',
      info: 'Build process packs up your templates as a single JavaScript '
            + 'payload, minifies your scripts/css/images, and rewrites asset '
            + 'names for caching.'
    }, {
      name: 'Deployment Ready',
      info: 'Easily deploy your app to Heroku or Openshift with the heroku '
            + 'and openshift subgenerators'
    });
  });

User.find({}).remove()
  .then(() => {
    User.create({
      provider: 'local',
      name: 'user',
      email: 'user@user.com',
      password: 'user'
    }, {
      provider: 'local',
      role: 'dev',
      name: 'Dev',
      email: 'dev@dev.com',
      password: 'dev'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@admin.com',
      password: 'admin'
    }, {
      provider: 'local',
      name: 'delete',
      email: 'delete@delete.com',
      password: 'delete',
      status: 'delete'
    }, {
      provider: 'local',
      name: 'inactive',
      email: 'inactive@inactive.com',
      password: 'inactive',
      status: 'inactive'
    }, {
      provider: 'local',
      name: 'deactive',
      email: 'deactive@deactive.com',
      password: 'deactive',
      status: 'deactive'
    })
    .then(() => {
      console.log('finished populating users');
    });
  });

Category.find({}).remove()
  .then(() => {
    Category.create({
      name: 'Books',
      info: 'Book category'
    }, {
      name: 'Games',
      info: 'Game category'
    }, {
      name: 'Deletes',
      info: 'Delete category',
      status: 'delete'
    }, {
      name: 'Deactives',
      info: 'Deactive category',
      status: 'deactive'
    });
  });
