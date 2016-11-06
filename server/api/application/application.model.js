'use strict';

import mongoose from 'mongoose';

var Schema = mongoose.Schema;

var ApplicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  path: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true
  },
  iconPath: {
    type: String,
    required: true
  },
  coverPath: {
    type: String,
    required: true
  },
  screenshotPath: [{
    type: String
  }],
  version: {
    type: String,
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  status: {
    type: String,
    enum: ['unpublish', 'publish', 'depublish', 'block'],
    default: 'unpublish'
  }
}, { timestamps: true });

export default mongoose.model('Application', ApplicationSchema);
