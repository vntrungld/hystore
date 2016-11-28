/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import mongoose from 'mongoose';
import User from '../api/user/user.model';
import Category from '../api/category/category.model';
import Application from '../api/application/application.model';

const ObjectId = mongoose.Schema.Types.ObjectId;

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
    return Category.create({
      name: 'Books',
      slug: 'books',
      info: 'Book category'
    }, {
      name: 'Business',
      slug: 'business',
      info: 'Business category'
    }, {
      name: 'Catalogues',
      slug: 'catalogues',
      info: 'Catalogues category'
    }, {
      name: 'Education',
      slug: 'education',
      info: 'Education category'
    }, {
      name: 'Entertainment',
      slug: 'entertainment',
      info: 'Entertainment category'
    }, {
      name: 'Finance',
      slug: 'finance',
      info: 'Finance category'
    }, {
      name: 'Food & Drink',
      slug: 'food_and_drink',
      info: 'Food & Drink category'
    }, {
      name: 'Action',
      slug: 'action',
      info: 'Game Action Category'
    }, {
      name: 'Adventure',
      slug: 'adventure',
      info: 'Game Adventure'
    }, {
      name: 'Arcade',
      slug: 'arcade',
      info: 'Game Arcade Category'
    }, {
      name: 'Board',
      slug: 'board',
      info: 'Game Board Category'
    }, {
      name: 'Card',
      slug: 'card',
      info: 'Game Card Category'
    }, {
      name: 'Casino',
      slug: 'casino',
      info: 'Game Casino Category'
    }, {
      name: 'Dice',
      slug: 'dice',
      info: 'Game Dice Category'
    }, {
      name: 'Education',
      slug: 'game_education',
      info: 'Game Education Category'
    }, {
      name: 'Family',
      slug: 'family',
      info: 'Game Family Category'
    }, {
      name: 'Music',
      slug: 'game_music',
      info: 'Game Music Category'
    }, {
      name: 'Puzzle',
      slug: 'puzzle',
      info: 'Game Puzzle Category'
    }, {
      name: 'Racing',
      slug: 'racing',
      info: 'Game Racing Category'
    }, {
      name: 'Role-Playing',
      slug: 'role_playing',
      info: 'Game Role-Playing Category'
    }, {
      name: 'Simulation',
      slug: 'simulation',
      info: 'Game Simulation Category'
    }, {
      name: 'Sport',
      slug: 'sport',
      info: 'Game Sport Category'
    }, {
      name: 'Strategy',
      slug: 'strategy',
      info: 'Game Strategy Category'
    }, {
      name: 'Travia',
      slug: 'travia',
      info: 'Game Travia Category'
    }, {
      name: 'Word',
      slug: 'word',
      info: 'Game Word Category'
    }, {
      name: 'Games',
      slug: 'games',
      info: 'Games Category'
    }, {
      name: 'Health & Fitness',
      slug: 'health_and_fitness',
      info: 'Health & Fitness category'
    }, {
      name: 'Kids',
      slug: 'kids',
      info: 'Kids category'
    }, {
      name: 'Lifestyle',
      slug: 'lifestyle',
      info: 'Lifestyle category'
    }, {
      name: 'Magazines & Newspapers',
      slug: 'magazines_and_newspapers',
      info: 'Magazines & Newspapers category'
    }, {
      name: 'Medical',
      slug: 'medical',
      info: 'Medical category'
    }, {
      name: 'Music',
      slug: 'music',
      info: 'Music category'
    }, {
      name: 'Navigation',
      slug: 'navigation',
      info: 'Navigation category'
    }, {
      name: 'News',
      slug: 'news',
      info: 'News category'
    }, {
      name: 'Photo & Video',
      slug: 'photo_and_video',
      info: 'Photo & Video category'
    }, {
      name: 'Productivity',
      slug: 'productivity',
      info: 'Productivity category'
    }, {
      name: 'Reference',
      slug: 'reference',
      info: 'Reference category'
    }, {
      name: 'Shopping',
      slug: 'shopping',
      info: 'Shopping category'
    }, {
      name: 'Social Networking',
      slug: 'social_networking',
      info: 'Social Networking category'
    }, {
      name: 'Sports',
      slug: 'sports',
      info: 'Sports category'
    }, {
      name: 'Travel',
      slug: 'travel',
      info: 'Travel category'
    }, {
      name: 'Utilities',
      slug: 'utilities',
      info: 'Utilities category'
    }, {
      name: 'Weather',
      slug: 'weather',
      info: 'Weather category'
    }, {
      name: 'Deletes',
      slug: 'deletes',
      info: 'Delete category',
      status: 'delete'
    }, {
      name: 'Deactives',
      slug: 'deactives',
      info: 'Deactive category',
      status: 'deactive'
    });
  })
  .then(() => {
    const gameChildren = [ 'action', 'adventure', 'arcade', 'board', 'card',
      'casino', 'dice', 'game_education', 'family', 'game_music', 'puzzle',
      'racing', 'role_playing', 'simulation', 'sport', 'strategy', 'travia', 'word' ]

    Category.find({ slug: { $in: gameChildren } })
      .then(entities => {
        const entitiesId = entities.map(entity => entity._id);

        Category.findOne({ slug: 'games' })
          .then(gamesCategory => {
            entities.map(entity => {
              entity.parent = gamesCategory._id;
              entity.save();
            });

            gamesCategory.children = entitiesId;
            gamesCategory.save();
          });
      })
  });

Application.find({}).remove();
