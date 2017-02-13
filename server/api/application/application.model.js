'use strict';
/*eslint no-sync:0*/
/*eslint no-invalid-this:0*/
/*eslint prefer-rest-params:0*/

import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;
const mongoosePaginate = require('mongoose-paginate');

var ApplicationSchema = new mongoose.Schema({
  author: {
    type: ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  icon: {
    type: String,
    required: true
  },
  feature: {
    type: String,
    required: true
  },
  screenshots: {
    type: [{
      type: String
    }],
  },
  versions: [{
    major: {
      type: Number,
      min: 0,
      default: 0,
      required: true
    },
    minor: {
      type: Number,
      min: 0,
      default: 0,
      required: true
    },
    maintenance: {
      type: Number,
      min: 1,
      default: 1,
      required: true
    },
    whatsnew: String,
    archive: {
      type: String,
      required: true
    }
  }],
  currentVersionIndex: {
    type: Number,
    required: true,
    default: 0
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    ref: 'Category',
    required: true
  },
  stars: {
    type: [{ type: Number }],
    default: [0, 0, 0, 0, 0]
  },
  status: {
    type: String,
    enum: ['unpublish', 'publish', 'depublish', 'block', 'delete'],
    default: 'unpublish',
    required: true
  }
}, { timestamps: true });

/**
 * Virtual
 */

// Public current infomation
ApplicationSchema
  .virtual('current')
  .get(function() {
    const currentVersion = this.versions[this.currentVersionIndex];
    const author = {
      name: this.author.name,
      email: this.author.email
    };
    const category = {
      name: this.category.name,
      slug: this.category.slug
    };

    return {
      author,
      name: this.name,
      slug: this.slug,
      icon: this.icon,
      feature: this.feature,
      screenshots: this.screenshots,
      description: this.description,
      category,
      stars: this.stars,
      major: currentVersion.major,
      minor: currentVersion.minor,
      maintenance: currentVersion.maintenance,
      archive: currentVersion.archive
    };
  });

ApplicationSchema.virtual('dev')
  .get(function() {
    const category = {
      name: this.category.name,
      slug: this.category.slug
    };

    return {
      name: this.name,
      icon: this.icon,
      feature: this.feature,
      screenshots: this.screenshots,
      description: this.description,
      category,
      stars: this.stars,
      versions: this.versions,
      currentVersionIndex: this.currentVersionIndex,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  });

/**
 * Validations
 */

// Validate star limit of 5
ApplicationSchema
  .path('stars')
  .validate(function(val) {
    return val.length == 5;
  }, '{PATH} exceeds the limit of 5');

// Validate screenshot limit of 3 to 8
ApplicationSchema
  .path('screenshots')
  .validate(function(val) {
    return val.length >= 3 && val.length <= 8;
  }, '{PATH} limit 3 to 8');

ApplicationSchema
  .path('versions')
  .validate(function(val) {
    const totalVersion = this.versions.length;
    if(totalVersion >= 2) {
      const highestVersion = val[totalVersion - 2];
      const currentVersion = val[totalVersion - 1];
      const minMajor = highestVersion.major;
      const minMinor = highestVersion.minor;
      const minMaintenance = highestVersion.maintenance;
      const currentMajor = currentVersion.major;
      const currentMinor = currentVersion.minor;
      const currentMaintenance = currentVersion.maintenance;

      if(currentMajor > minMajor) {
        return true;
      } else if(currentMajor === minMajor) {
        if(currentMinor > minMinor) {
          return true;
        } else if(currentMinor === minMinor) {
          if(currentMaintenance > minMaintenance) {
            return true;
          } else {
            return false;
          }
        }
      }
      return false;
    } else {
      return true;
    }
  }, 'Your version must higher the highest version');

/**
 * Methods
 */

ApplicationSchema.methods = {
  version(idx) {
    if(idx < this.versions.length) {
      const specVersion = this.versions[idx];

      return {
        author: this.author,
        name: this.name,
        slug: this.slug,
        icon: this.icon,
        feature: this.feature,
        screenshots: this.screenshots,
        description: this.description,
        category: this.category,
        stars: this.stars,
        major: specVersion.major,
        minor: specVersion.minor,
        maintenance: specVersion.maintenance,
        archive: specVersion.archive
      };
    }

    return this.current;
  }
};

ApplicationSchema.plugin(mongoosePaginate);

export default mongoose.model('Application', ApplicationSchema);
