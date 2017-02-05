/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/applications                ->  index
 * POST    /api/applications                ->  create
 * GET     /api/applications/:slug          ->  show
 * PUT     /api/applications/:slug          ->  upsert
 * PATCH   /api/applications/:slug          ->  patch
 * DELETE  /api/applications/:slug          ->  destroy
 */

'use strict';

import Application from './application.model';
import Category from '../category/category.model';

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

function applicationFind(query) {
  let queries = [{ status: 'publish' }];

  if(query) {
    queries.push(query);
  }

  return Application.find({ $and: queries })
    .populate('category author')
    .exec()
    .then(function(entities) {
      return entities.map(function(entity) {
        return entity.current;
      });
    });
}

// Gets a list of Applications
export function index(req, res) {
  if(req.query.category) {
    return Category.findOne({ slug: req.query.category })
      .exec()
      .then(function(cat) {
        applicationFind({ category: cat._id })
          .then(respondWithResult(res))
          .catch(handleError(res));
      })
      .catch(handleError(res));
  }

  return applicationFind()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Application from the DB
export function show(req, res) {
  return Application.findOne({ slug: req.params.slug })
    .populate('author category')
    .exec()
    .then(function(entity) {
      return entity.current;
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
