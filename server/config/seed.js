/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';
import Category from '../api/category/category.model';
import Application from '../api/application/application.model';
import Review from '../api/review/review.model';

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
  .then(() => Category.create({
    name: 'Books',
    _id: 'books',
    info: 'Book category'
  }, {
    name: 'Business',
    _id: 'business',
    info: 'Business category'
  }, {
    name: 'Catalogues',
    _id: 'catalogues',
    info: 'Catalogues category'
  }, {
    name: 'Education',
    _id: 'education',
    info: 'Education category'
  }, {
    name: 'Entertainment',
    _id: 'entertainment',
    info: 'Entertainment category'
  }, {
    name: 'Finance',
    _id: 'finance',
    info: 'Finance category'
  }, {
    name: 'Food & Drink',
    _id: 'food_and_drink',
    info: 'Food & Drink category'
  }, {
    name: 'Action',
    _id: 'action',
    info: 'Game Action Category'
  }, {
    name: 'Adventure',
    _id: 'adventure',
    info: 'Game Adventure'
  }, {
    name: 'Arcade',
    _id: 'arcade',
    info: 'Game Arcade Category'
  }, {
    name: 'Board',
    _id: 'board',
    info: 'Game Board Category'
  }, {
    name: 'Card',
    _id: 'card',
    info: 'Game Card Category'
  }, {
    name: 'Casino',
    _id: 'casino',
    info: 'Game Casino Category'
  }, {
    name: 'Dice',
    _id: 'dice',
    info: 'Game Dice Category'
  }, {
    name: 'Education',
    _id: 'game_education',
    info: 'Game Education Category'
  }, {
    name: 'Family',
    _id: 'family',
    info: 'Game Family Category'
  }, {
    name: 'Music',
    _id: 'game_music',
    info: 'Game Music Category'
  }, {
    name: 'Puzzle',
    _id: 'puzzle',
    info: 'Game Puzzle Category'
  }, {
    name: 'Racing',
    _id: 'racing',
    info: 'Game Racing Category'
  }, {
    name: 'Role-Playing',
    _id: 'role_playing',
    info: 'Game Role-Playing Category'
  }, {
    name: 'Simulation',
    _id: 'simulation',
    info: 'Game Simulation Category'
  }, {
    name: 'Sport',
    _id: 'sport',
    info: 'Game Sport Category'
  }, {
    name: 'Strategy',
    _id: 'strategy',
    info: 'Game Strategy Category'
  }, {
    name: 'Travia',
    _id: 'travia',
    info: 'Game Travia Category'
  }, {
    name: 'Word',
    _id: 'word',
    info: 'Game Word Category'
  }, {
    name: 'Games',
    _id: 'games',
    info: 'Games Category'
  }, {
    name: 'Health & Fitness',
    _id: 'health_and_fitness',
    info: 'Health & Fitness category'
  }, {
    name: 'Kids',
    _id: 'kids',
    info: 'Kids category'
  }, {
    name: 'Lifestyle',
    _id: 'lifestyle',
    info: 'Lifestyle category'
  }, {
    name: 'Magazines & Newspapers',
    _id: 'magazines_and_newspapers',
    info: 'Magazines & Newspapers category'
  }, {
    name: 'Medical',
    _id: 'medical',
    info: 'Medical category'
  }, {
    name: 'Music',
    _id: 'music',
    info: 'Music category'
  }, {
    name: 'Navigation',
    _id: 'navigation',
    info: 'Navigation category'
  }, {
    name: 'News',
    _id: 'news',
    info: 'News category'
  }, {
    name: 'Photo & Video',
    _id: 'photo_and_video',
    info: 'Photo & Video category'
  }, {
    name: 'Productivity',
    _id: 'productivity',
    info: 'Productivity category'
  }, {
    name: 'Reference',
    _id: 'reference',
    info: 'Reference category'
  }, {
    name: 'Shopping',
    _id: 'shopping',
    info: 'Shopping category'
  }, {
    name: 'Social Networking',
    _id: 'social_networking',
    info: 'Social Networking category'
  }, {
    name: 'Sports',
    _id: 'sports',
    info: 'Sports category'
  }, {
    name: 'Travel',
    _id: 'travel',
    info: 'Travel category'
  }, {
    name: 'Utilities',
    _id: 'utilities',
    info: 'Utilities category'
  }, {
    name: 'Weather',
    _id: 'weather',
    info: 'Weather category'
  }, {
    name: 'Deletes',
    _id: 'deletes',
    info: 'Delete category',
    status: 'delete'
  }, {
    name: 'Deactives',
    _id: 'deactives',
    info: 'Deactive category',
    status: 'deactive'
  }))
  .then(() => {
    const gameChildren = ['action', 'adventure', 'arcade', 'board', 'card',
      'casino', 'dice', 'game_education', 'family', 'game_music', 'puzzle',
      'racing', 'role_playing', 'simulation', 'sport', 'strategy', 'travia', 'word'];

    Category.find({ _id: { $in: gameChildren } })
      .then(entities => {
        const entitiesSlug = entities.map(entity => entity._id);

        Category.findOne({ _id: 'games' })
          .then(gamesCategory => {
            entities.forEach(entity => {
              entity.parent = gamesCategory._id;
              entity.save();
            });

            gamesCategory.children = entitiesSlug;
            gamesCategory.save();
          });
      });
  });

Application.find({}).remove();

Review.find({}).remove();
