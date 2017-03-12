/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/dev/reviews              ->  index
 * PATCH   /api/dev/reviews/:id          ->  patch
 */

'use strict';
/* eslint prefer-reflect: 0 */

import jsonpatch from 'fast-json-patch';
import Review from '../../review/review.model';

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

// Gets a list of Reviews
export function index(req, res) {
  let query = req.query;
  query.to = req.user._id;
  return Review.find(query)
    .populate('from for')
    .exec()
    .then(function(reviews) {
      return reviews.map(function(review) {
        return review.dev;
      });
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Review in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
    delete req.body.createdAt;
    delete req.body.updatedAt;
  }
  return Review.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(function(review) {
      return Review.populate(review, 'from for')
        .then(function(populatedReview) {
          return populatedReview.dev;
        });
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}
