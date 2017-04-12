'use strict';
/*eslint no-process-env:0*/

import path from 'path';
import _ from 'lodash';

/*function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}*/

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(`${__dirname}/../../..`),

  // Browser-sync port
  browserSyncPort: process.env.BROWSER_SYNC_PORT || 3000,

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'hystore-secret'
  },

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  // Hard disk storage location
  path: '/tmp/',
  upload: [{
    name: 'archive',
    maxCount: 1
  }, {
    name: 'icon',
    maxCount: 1
  }, {
    name: 'feature',
    maxCount: 1
  }, {
    name: 'screenshots',
    maxCount: 8
  }],
  aws: {
    accessKeyId: 'AKIAIOM2MOAGABWEBB7Q',
    secretAccessKey: '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',
    region: 'ap-southeast-1'
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./shared'),
  require(`./${process.env.NODE_ENV}.js`) || {});
