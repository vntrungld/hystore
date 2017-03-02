'use strict';

import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;

var CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  parent: {
    type: ObjectId,
    ref: 'Category'
  },
  children: [
    {
      type: ObjectId,
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
