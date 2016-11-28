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
    type: ObjectId,
    ref: 'Category'
  },
  status: {
    type: String,
    enum: ['unpublish', 'publish', 'depublish', 'block'],
    default: 'unpublish',
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Application', ApplicationSchema);
