/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/applications              ->  index
 * GET     /api/applications/:id          ->  show
 */

'use strict';

import Application from './application.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
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
  let query = req.query;
  query.status = 'publish';

  if(query.search) {
    query.name = new RegExp(`^.*${query.search}.*$`, 'i');
    delete query.search;
  }

  return Application.find(query)
    .populate('category author')
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Application from the DB
export function show(req, res) {
  return Application.findById(req.params.id)
    .populate('author category')
    .exec()
    .then(function(entity) {
      return entity.current;
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
