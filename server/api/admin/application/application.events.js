/**
 * Application model events
 */

'use strict';

import {EventEmitter} from 'events';
import Application from './application.model';
var ApplicationEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ApplicationEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Application.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ApplicationEvents.emit(`${event}:${doc._id}`, doc);
    ApplicationEvents.emit(event, doc);
  };
}

export default ApplicationEvents;
