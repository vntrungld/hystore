/**
 * Category model events
 */

'use strict';

import {EventEmitter} from 'events';
import Category from './category.model';
var CategoryEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CategoryEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Category.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    CategoryEvents.emit(event + ':' + doc._id, doc);
    CategoryEvents.emit(event, doc);
  };
}

export default CategoryEvents;
