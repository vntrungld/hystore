/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/applications              ->  index
 * POST    /api/applications              ->  create
 * GET     /api/applications/:slug          ->  show
 * GET     /api/applications/:slug/reviews          ->  reviews
 * GET     /api/applications/file/:filename  ->  file
 * PUT     /api/applications/:slug          ->  upsert
 * PATCH   /api/applications/:slug          ->  patch
 * DELETE  /api/applications/:slug          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Application from './application.model';
import Review from '../review/review.model';

const util = require('../../utilities');

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      const prefix = '/api/file/';

      if(entity.length) {
        entity = entity.map(app => {
          app.icon = `${prefix}${app.icon}`;
          return app;
        });
      } else {
        entity.icon = prefix + entity.icon;
        entity.feature = prefix + entity.feature;
      }

      if(entity.screenshots !== undefined) {
        entity.screenshots = entity.screenshots.map(screenshot => prefix + screenshot);
      }

      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true); // eslint-disable-line
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Applications
export function index(req, res) {
  return Application.find()
    .populate('author')
    .populate('category')
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function indexById(req, res) {
  return Application.find({ author: req.params.id }).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Application from the DB
export function show(req, res) {
  return Application.findOne({ slug: req.params.slug })
    .populate('category')
    .populate('author')
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets Application reviews
export function reviews(req, res) {
  return Review.find({ for: req.params.slug })
    .populate('from')
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Application in the DB
export function create(req, res) {
  let data = req.body;
  data.archive = req.files.archive[0].filename;
  data.icon = req.files.icon[0].filename;
  data.feature = req.files.feature[0].filename;
  data.screenshots = req.files.screenshots.map(screenshot => screenshot.filename);
  data.slug = util.slugify(req.body.name);
  data.author = req.user._id;

  return Application.create(data)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Application in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id; // eslint-disable-line
  }
  return Application.findOneAndUpdate({
    $and: [
      { author: req.user._id },
      { slug: req.params.slug }
    ]
  }, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Application in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id; // eslint-disable-line
  }
  return Application.findById({
    $and: [
      { author: req.user._id },
      { slug: req.params.slug }
    ]
  }).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Application from the DB
export function destroy(req, res) {
  return Application.findById({ slug: req.params.slug }).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
