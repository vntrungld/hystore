/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

import User from '../api/user/user.model';
import Category from '../api/category/category.model';
import Application from '../api/application/application.model';
import Review from '../api/review/review.model';
const Promise = require('bluebird');

let user = {};
let dev = {};
let gameCategory = {};
let app = {};
const gameCategoriesQuery = [
  {
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
  },
];

const normalCategoriesQuery = [
  {
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
  }
];

const gameCategoryQuery = {
  name: 'Games',
  slug: 'games',
  info: 'Games Category'
};

function seedUser() {
  return User.find({}).remove()
    .then(function() {
      return User.create({
        provider: 'local',
        name: 'user',
        email: 'user@user.com',
        password: 'user'
      }).then(function(entity) {
        user = entity;
      });
    })
    .then(function() {
      return User.create({
        provider: 'local',
        role: 'dev',
        name: 'Dev',
        email: 'dev@dev.com',
        password: 'dev'
      })
      .then(function(entity) {
        dev = entity;
      });
    })
    .then(function() {
      return User.create({
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
      });
    })
    .then(function() {
      console.log('finished populating users');
    });
}

function insertCategoryRelationship(category) {
  return function(entities) {
    const entityIds = entities.map(function(entity) {
      let addedParrentEntity = entity;
      addedParrentEntity.parent = category._id;
      addedParrentEntity.save();
      return addedParrentEntity._id;
    });
    category.children = entityIds;
    return category.save();
  };
}

function seedCategory() {
  return Category.find({}).remove()
    .then(function() {
      return Category.create(normalCategoriesQuery);
    })
    .then(function() {
      return Category.create(gameCategoryQuery)
        .then(function(entity) {
          gameCategory = entity;
        });
    })
    .then(function() {
      return Category.create(gameCategoriesQuery).then(insertCategoryRelationship(gameCategory));
    })
    .then(function() {
      console.log('finished populating categories');
    });
}

function seedApplication() {
  return Application.find({}).remove()
    .then(function() {
      return Application.create({
        author: dev._id,
        name: 'Clash Of Clans',
        slug: 'clash-of-clans',
        category: gameCategory._id,
        icon: 'https://s3-ap-southeast-1.amazonaws.com/hystore-dev/dev@dev.com/clash-of-clans/icon.png',
        feature: 'https://s3-ap-southeast-1.amazonaws.com/hystore-dev/dev@dev.com/clash-of-clans/feature.jpg',
        screenshots: [
          'https://s3-ap-southeast-1.amazonaws.com/hystore-dev/dev@dev.com/clash-of-clans/screenshot-1.jpg',
          'https://s3-ap-southeast-1.amazonaws.com/hystore-dev/dev@dev.com/clash-of-clans/screenshot-2.jpg',
          'https://s3-ap-southeast-1.amazonaws.com/hystore-dev/dev@dev.com/clash-of-clans/screenshot-3.jpg',
          'https://s3-ap-southeast-1.amazonaws.com/hystore-dev/dev@dev.com/clash-of-clans/screenshot-4.jpg',
          'https://s3-ap-southeast-1.amazonaws.com/hystore-dev/dev@dev.com/clash-of-clans/screenshot-5.jpg'
        ],
        versions: [{
          major: 1,
          minor: 2,
          maintenance: 3,
          whatsnew: 'Merry Clashmas! • A slew of special events are in store • New levels for Heroes, Golem and more • Dragon and P.E.K.K.A are striking so fast • Discounts and boosting, it’s Clashmas at last!', // eslint-disable-line
          archive: 'https://s3-ap-southeast-1.amazonaws.com/hystore-dev/dev@dev.com/clash-of-clans/v1.2.3/coc.zip'
        }],
        description: '<div><!--block-->From rage-­filled Barbarians with glorious mustaches to pyromaniac wizards, raise your own army and lead your clan to victory! Build your village to fend off raiders, battle against millions of players worldwide, and forge a powerful clan with others to destroy enemy clans.<br><br>PLEASE NOTE! Clash of Clans is free to download and play, however some game items can also be purchased for real money. If you do not want to use this feature, please set up password protection for purchases in the settings of your Google Play Store app. Also, under our Terms of Service and Privacy Policy, you must be at least 13 years of age to play or download Clash of Clans.<br><br>A network connection is also required.<br><br>FEATURES</div><ul><li><!--block-->Build your village into an unbeatable fortress&nbsp;</li><li><!--block-->Raise your own army of Barbarians, Archers, Hog Riders, Wizards, Dragons and other mighty fighters</li><li><!--block-->Battle with players worldwide and take their Trophies</li><li><!--block-->Join together with other players to form the ultimate Clan</li><li><!--block-->Fight against rival Clans in epic Clan Wars&nbsp;</li><li><!--block-->Build 20 unique units with multiple levels of upgrades</li><li><!--block-->Discover your favorite attacking army from countless combinations of troops, spells, Heroes and Clan reinforcements&nbsp;</li><li><!--block-->Defend your village with a multitude of Cannons, Towers, Mortars, Bombs, Traps and Walls</li><li><!--block-->Fight against the Goblin King in a campaign through the realm</li></ul><div><!--block--><br><br>PLAYER REVIEWS&nbsp;<br>Clash of Clans proudly announces over five million five star reviews on Google Play.<br><br><br>SUPPORT<br>Chief, are you having problems? Visit http://supercell.helpshift.com/a/clash-of-clans/ or http://supr.cl/ClashForum or contact us in game by going to Settings &gt; Help and Support.<br><br>Privacy Policy:<br>http://www.supercell.net/privacy-policy/<br><br>Terms of Service:<br>http://www.supercell.net/terms-of-service/<br><br>Parent’s Guide:<br>http://www.supercell.net/parents</div>', // eslint-disable-line
        stars: [123, 4, 56, 7, 89],
        status: 'publish'
      })
        .then(function(entity) {
          app = entity;
        });
    })
    .then(function() {
      console.log('finished populating applications');
    });
}

function seedReview() {
  return Review.find({}).remove()
    .then(function() {
      return Review.create({
        from: user._id,
        to: dev._id,
        for: app._id,
        star: 5,
        content: 'Awesome!!'
      });
    })
    .then(function() {
      console.log('finished populating reviews');
    });
}

const steps = [seedUser, seedCategory, seedApplication, seedReview];

Promise.each(steps, function(step) {
  return step();
});
