/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/reviews              ->  index
 * POST    /api/reviews              ->  create
 * PUT     /api/reviews/:id          ->  upsert
 * PATCH   /api/reviews/:id          ->  patch
 * DELETE  /api/reviews/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Review from './review.model';
import Application from '../application/application.model';

const respondWithResult = (res, statusCode) => {
  statusCode = statusCode || 200;
  return entity => {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
};

const patchUpdates = patches =>
  entity => {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true); // eslint-disable-line
    } catch(err) {
      return Promise.reject(err);
    }
    return entity.save();
  };

const removeEntity = res =>
  entity => {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };

const handleEntityNotFound = res =>
  entity => {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };

const handleError = (res, statusCode) => {
  statusCode = statusCode || 500;
  return err => {
    res.status(statusCode).send(err);
  };
};

// Gets a list of Reviews
export const index = function(req, res) {
  Application.findOne({ slug: req.query.application }).exec()
    .then(function(app) {
      Review.find({ for: app._id })
        .populate('from')
        .exec()
        .then(function(entities) {
          return entities.map(function(entity) {
            return entity.public;
          });
        })
        .then(respondWithResult(res))
        .catch(handleError(res));
    })
    .catch(handleError(res));
};

// Creates a new Review in the DB
export const create = (req, res) => {
  Application.findOne({ slug: req.body.for }).exec()
    .then(app => {
      req.body.from = req.user._id;
      req.body.to = app.author;
      req.body.for = app._id;

      return Review.create(req.body)
        .then(function(review) {
          let stars = app.stars;
          const starIdx = req.body.star - 1;
          stars[starIdx]++;

          app.update({ $set: { stars } }).exec();

          return review;
        })
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
    })
    .catch(handleError(res));
};


// Upserts the given Review in the DB at the specified ID
export const upsert = (req, res) => {
  if(req.body._id) {
    delete req.body._id; // eslint-disable-line
  }
  return Review.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
};

// Updates an existing Review in the DB
export const patch = (req, res) => {
  if(req.body._id) {
    delete req.body._id; // eslint-disable-line
  }
  return Review.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
};

// Deletes a Review from the DB
export const destroy = (req, res) =>
  Review.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
