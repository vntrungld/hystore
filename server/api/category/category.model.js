'use strict';

import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;

var CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
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

/**
 * Validations
 */

// Validate empty category name
CategorySchema
  .path('name')
  .validate(function(name) {
    return name.length;
  }, 'Name cannot be blank');

export default mongoose.model('Category', CategorySchema);
