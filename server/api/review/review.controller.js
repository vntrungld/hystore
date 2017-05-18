/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/reviews              ->  index
 * GET     /api/reviews/:id          ->  show
 * POST    /api/reviews              ->  create
 * PUT     /api/reviews/:id          ->  upsert
 * PATCH   /api/reviews/:id          ->  patch
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
      return Application.findById(entity.for)
        .then(function(app) {
          let stars = app.stars;
          const oldStarIdx = entity.star - 1;
          const newStarIdx = patches[0].value - 1;
          stars[oldStarIdx] -= 1;
          stars[newStarIdx] += 1;

          return app.update({ $set: { stars } }).exec()
            .then(function() {
              jsonpatch.apply(entity, patches, /*validate*/ true); // eslint-disable-line
              return entity.save();
            });
        });
    } catch(err) {
      return Promise.reject(err);
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
  Review.find({ for: req.query.application })
    .populate('from')
    .exec()
    .then(function(entities) {
      return entities.map(function(entity) {
        return entity.public;
      });
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
};

// Gets own review
export function show(req, res) {
  return Review.findOne({ from: req.user._id, for: req.query.application }).exec()
    .then(function(entity) {
      return entity.public;
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Review in the DB
export const create = (req, res) => {
  Application.findById(req.body.for).exec()
    .then(app => {
      Review.findOne({ from: req.user._id, for: app._id }).exec()
        .then(existedReview => {
          if(existedReview) {
            res.status(500).send('You already review for this app');
          } else {
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
          }
        })
        .catch(handleError(res));
    })
    .catch(handleError(res));
};


// Upserts the given Review in the DB at the specified ID
export function upsert(req, res) {
  return Review.findByIdAndUpdate(req.params.id, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

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
