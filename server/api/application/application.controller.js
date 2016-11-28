/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/applications              ->  index
 * POST    /api/applications              ->  create
 * GET     /api/applications/:id          ->  show
 * GET     /api/applications/file/:filename  ->  file
 * PUT     /api/applications/:id          ->  upsert
 * PATCH   /api/applications/:id          ->  patch
 * DELETE  /api/applications/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Application from './application.model';

const util = require('../../utilities');

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      const prefix = '/api/file/';

      entity.icon = prefix + entity.icon;
      entity.feature = prefix + entity.feature;
      if(entity.screenshots !== undefined) {
        entity.screenshots = entity.screenshots.map(screenshot => {
          return prefix + screenshot;
        });
      }

      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
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
  return Application.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Application from the DB
export function show(req, res) {
  return Application.findOne({ slug: req.params.slug }).populate('categories').exec()
    .then(handleEntityNotFound(res))
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
    delete req.body._id;
  }
  return Application.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Application in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Application.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Application from the DB
export function destroy(req, res) {
  return Application.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
