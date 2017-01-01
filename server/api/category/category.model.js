'use strict';

import mongoose from 'mongoose';

var CategorySchema = new mongoose.Schema({
  _id: String,
  name: {
    type: String,
    required: true,
  },
  parent: {
    type: String,
    ref: 'Category'
  },
  children: [
    {
      type: String,
      ref: 'Category'
    }
  ],
  info: String,
  status: {
    type: String,
    enum: ['active', 'deactive', 'delete'],
    default: 'active'
  }
}, { timestamps: true });

export default mongoose.model('Category', CategorySchema);
