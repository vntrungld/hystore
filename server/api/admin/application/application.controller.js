/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/admin/applications              ->  index
 * GET     /api/admin/applications/:id          ->  show
 * PATCH   /api/admin/applications/:id          ->  patch
 * DELETE  /api/admin/applications/:id          ->  destroy
 */

'use strict';

import Application from '../../application/application.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    entity.status = patches.status;

    const populateQuery = [
      {
        path: 'author',
        select: 'email name'
      }, {
        path: 'category',
      }
    ];

    return entity.save()
      .then(function(newEntity) {
        return Application.populate(newEntity, populateQuery);
      });
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

// Gets a single Application from the DB
export function show(req, res) {
  return Application.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Application in the DB
export function patch(req, res) {
  if(req.body.status) {
    if(req.body._id) {
      delete req.body._id; // eslint-disable-line
    }
    return Application.findById(req.params.id).exec()
      .then(handleEntityNotFound(res))
      .then(patchUpdates(req.body))
      .then(respondWithResult(res))
      .catch(handleError(res));
  } else {
    return res.status(500).end('You can change only the status');
  }
}
