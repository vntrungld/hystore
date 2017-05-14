'use strict';
/*eslint no-sync:0*/
/*eslint no-invalid-this:0*/
/*eslint prefer-rest-params:0*/

import mongoose from 'mongoose';
import {slugify} from '../../utilities';

const ObjectId = mongoose.Schema.Types.ObjectId;
const mongoosePaginate = require('mongoose-paginate');

var ApplicationSchema = new mongoose.Schema({
  author: {
    type: ObjectId,
    required: true,
    ref: 'User'
  },
  slug: String,
  name: {
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
      _id: this.author._id,
      name: this.author.name,
      email: this.author.email
    };
    const category = {
      _id: this.category._id,
      name: this.category.name,
    };

    return {
      _id: this._id,
      author,
      name: this.name,
      icon: this.icon,
      feature: this.feature,
      screenshots: this.screenshots,
      description: this.description,
      category,
      stars: this.stars,
      major: currentVersion.major,
      minor: currentVersion.minor,
      maintenance: currentVersion.maintenance,
      archive: currentVersion.archive,
      whatsnew: currentVersion.whatsnew
    };
  });

ApplicationSchema.virtual('dev')
  .get(function() {
    const category = {
      name: this.category.name,
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

// Validate empty application name
ApplicationSchema
  .path('name')
  .validate(function(name) {
    return name.length;
  }, 'Name cannot be blank');

// Validate application icon
ApplicationSchema
  .path('icon')
  .validate(function(url) {
    return url.length;
  }, 'Icon is required');

// Validate application feature
ApplicationSchema
  .path('feature')
  .validate(function(url) {
    return url.length;
  }, 'Feature is required');

// Validate empty application description
ApplicationSchema
  .path('description')
  .validate(function(desc) {
    return desc.length;
  }, 'Description cannot be blank');

// Validate star limit of 5
ApplicationSchema
  .path('stars')
  .validate(function(val) {
    return val.length == 5;
  }, '{PATH} exceeds the limit of 5');

// Validate screenshot limit of 3 to 8
ApplicationSchema
  .path('screenshots')
  .validate(function(urls) {
    return urls.length >= 3 && urls.length <= 8;
  }, '{PATH} limit 3 to 8');

// Validate application category
ApplicationSchema
  .path('category')
  .validate(function(id) {
    return id.length;
  }, 'Category is required');

ApplicationSchema
  .path('versions')
  .validate(function(val) {
    const totalVersion = this.versions.length;
    const currentVersion = val[totalVersion - 1];
    const currentMajor = currentVersion.major;
    const currentMinor = currentVersion.minor;
    const currentMaintenance = currentVersion.maintenance;

    if(totalVersion >= 2) {
      const highestVersion = val[totalVersion - 2];
      const minMajor = highestVersion.major;
      const minMinor = highestVersion.minor;
      const minMaintenance = highestVersion.maintenance;

      if(currentMajor > minMajor) {
        return true;
      } else if(currentMajor === minMajor) {
        if(currentMinor > minMinor) {
          return true;
        } else if(currentMinor === minMinor) {
          if(currentMaintenance > minMaintenance) {
            return true;
          }
        }
      }
      return false;
    } else {
      return currentMajor >= 0 && currentMinor >= 0 && currentMaintenance > 0;
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

/**
 *  Pre
 */

ApplicationSchema
  .pre('save', function(next) {
    if(!this.slug) {
      this.slug = slugify(this.name);
    }
    next();
  });

ApplicationSchema.plugin(mongoosePaginate);

export default mongoose.model('Application', ApplicationSchema);
