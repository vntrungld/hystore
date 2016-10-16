'use strict';

import mongoose from 'mongoose';

var CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  info: String,
  status: {
    type: String,
    enum: ['active', 'deactive', 'delete'],
    default: 'active'
  }
}, { timestamps: true });

export default mongoose.model('Category', CategorySchema);
