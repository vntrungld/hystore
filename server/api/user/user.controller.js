'use strict';

import User from './user.model';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import jsonpatch from 'fast-json-patch';

const validationError = (res, statusCode) => {
  statusCode = statusCode || 422;
  return err => res.status(statusCode).json(err);
};

const handleError = (res, statusCode) => {
  statusCode = statusCode || 500;
  return err => res.status(statusCode).send(err);
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

/**
 * Creates a new user
 */
export const create = (req, res) => {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.save()
    .then(user => {
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({ token });
    })
    .catch(validationError(res));
};

/**
 * Get a single user
 */
export const show = (req, res, next) => {
  var userId = req.params.id;

  return User.findById(userId).exec()
    .then(user => {
      if(!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
};

/**
 * Change a users password
 */
export const changePassword = (req, res) => {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.findById(userId).exec()
    .then(user => {
      if(user.authenticate(oldPass)) {
        user.password = newPass;
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

/**
 * Change a users profile
 */
export const changeProfile = (req, res) => {
  var profile = req.body.profile;
  var profileId = profile._id;
  var userId = req.user._id;

  if(userId == profileId) {
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
  } else {
    return res.status(403).end();
  }
};

/**
 * Patch my user
 */
export const patch = (req, res) => {
  if(req.body._id) {
    delete req.body._id;
  }

  return User.findById(req.user._id)
    .exec()
    .then(patchUpdates(req.body))
    .catch(handleError(res));
};

/**
 * Get my info
 */
export const me = (req, res, next) => {
  var userId = req.user._id;

  return User.findOne({ _id: userId }, '-salt -password').exec()
    .then(user => { // don't ever give out the password or salt
      if(!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
};

/**
 * Authentication callback
 */
export const authCallback = (req, res) => {
  res.redirect('/');
};
