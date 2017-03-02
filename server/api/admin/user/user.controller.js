'use strict';
/* eslint prefer-reflect: 0 */

import jsonpatch from 'fast-json-patch';
import User from '../../user/user.model';

const validationError = (res, statusCode) => {
  statusCode = statusCode || 422;
  return err => res.status(statusCode).json(err);
};

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
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }
    return entity.save();
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
  return err => res.status(statusCode).send(err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
export const index = (req, res) =>
  User.find({status: { $ne: 'delete' }}, '-salt -password').exec()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));

/**
 * Change a users profile
 */
export const changeProfile = (req, res) => {
  var profile = req.body;
  var profileId = req.params.id;

  return User.findById(profileId).exec()
    .then(user => {
      if(user) {
        user.name = profile.name;
        user.role = profile.role;
        user.status = profile.status;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
};

// Updates an existing User in the DB
export const patch = (req, res) => {
  if(req.body._id) {
    delete req.body._id;
  }

  return User.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
export const destroy = (req, res) =>
  User.findById(req.params.id)
    .exec()
    .then(user => {
      user.status = 'delete';
      return user.save()
        .then(() => {
          res.status(204).end();
        })
        .catch(validationError(res));
    })
    .catch(handleError(res));
