'use strict';
/*eslint no-invalid-this:0*/

import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.ObjectId;

var ReviewSchema = new mongoose.Schema({
  from: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  for: {
    type: ObjectId,
    ref: 'Application',
    required: true
  },
  star: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread'
  }
}, { timestamps: true });

ReviewSchema
  .virtual('public')
  .get(function() {
    return {
      name: this.from.name,
      email: this.from.email,
      avatar: this.from.avatar,
      star: this.star,
      content: this.content,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  });

ReviewSchema
  .virtual('dev')
  .get(function() {
    return {
      _id: this._id,
      name: this.from.name,
      email: this.from.email,
      star: this.star,
      content: this.content,
      for: this.for.name,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  });

export default mongoose.model('Review', ReviewSchema);
