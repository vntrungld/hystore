'use strict';

import User from './user.model';
import Application from '../application/application.model';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';

const respondWithResult = (res, statusCode) => {
  statusCode = statusCode || 200;
  return entity => {
    if(entity) {
      const prefix = '/api/file/';

      entity.icon = prefix + entity.icon;
      entity.feature = prefix + entity.feature;
      if(entity.screenshots !== undefined) {
        entity.screenshots = entity.screenshots.map(screenshot => `${prefix}${screenshot}`
        );
      }

      return res.status(statusCode).json(entity);
    }
    return null;
  };
};

const validationError = (res, statusCode) => {
  statusCode = statusCode || 422;
  return err => res.status(statusCode).json(err);
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
 * Get list application of user
 */
export const listApp = (req, res) => {
  var userId = req.params.id;

  return Application.find({ author: userId }).exec()
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
  var userId = profile._id;

  return User.findById(userId).exec()
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
