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
  archive: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  feature: {
    type: String,
    required: true
  },
  screenshots: [{
    type: String
  }],
  version: {
    type: String,
    required: true
  },
  category: {
    type: String,
    ref: 'Category'
  },
  oneStar: {
    type: Number,
    default: 0,
    required: true
  },
  twoStar: {
    type: Number,
    default: 0,
    required: true
  },
  threeStar: {
    type: Number,
    default: 0,
    required: true
  },
  fourStar: {
    type: Number,
    default: 0,
    required: true
  },
  fiveStar: {
    type: Number,
    default: 0,
    required: true
  },
  totalRate: {
    type: Number,
    default: 0,
    required: true
  },
  status: {
    type: String,
    enum: ['unpublish', 'publish', 'depublish', 'block'],
    default: 'unpublish',
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Application', ApplicationSchema);
