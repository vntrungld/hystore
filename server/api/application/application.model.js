'use strict';

import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;

var ApplicationSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true,
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
    ref: 'Category',
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
