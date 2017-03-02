/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/categories              ->  index
 * GET     /api/categories/:id          ->  show
 */

'use strict';
/* eslint prefer-reflect: 0 */

import Category from './category.model';

const respondWithResult = (res, statusCode) => {
  statusCode = statusCode || 200;
  return entity => {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
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

// Gets a list of Categories
export const index = (req, res) =>
  Category.find({ status: { $ne: 'delete' } })
    .populate('parent children')
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));

// Gets a single Category from the DB
export const show = (req, res) =>
  Category.findById(req.params.id)
    .populate('parent children')
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
