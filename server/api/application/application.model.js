'use strict';

import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;

var ApplicationSchema = new mongoose.Schema({
  author: {
    type: ObjectId,
    ref: 'User',
    required: true
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
    validate: [screenshotRange, '{PATH} limit 3 to 8']
  },
  versions: [
    {
      major: {
        type: Number,
        required: true
      },
      minor: {
        type: Number,
        required: true
      },
      maintenance: {
        type: Number,
        required: true
      },
      whatsnew: String,
      archive: {
        type: String,
        required: true
      },
    }
  ],
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
    ref: 'Category'
  },
  stars: {
    type: [{ type: Number }],
    default: [0, 0, 0, 0, 0],
    validate: [starLimit, '{PATH} exceeds the limit of 5']
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
export default mongoose.model('Application', ApplicationSchema);
