/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/categories              ->  index
 * POST    /api/categories              ->  create
 * GET     /api/categories/:id          ->  show
 * PUT     /api/categories/:id          ->  upsert
 * PATCH   /api/categories/:id          ->  patch
 * DELETE  /api/categories/:id          ->  destroy
 */

'use strict';
/* eslint prefer-reflect: 0 */

import jsonpatch from 'fast-json-patch';
import Category from './category.model';

const util = require('../../utilities');

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

// Gets a list of Categories
export const index = (req, res) =>
  Category.find()
    .populate('parent')
    .populate('children')
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));

// Gets a single Category from the DB
export const show = (req, res) =>
  Category.findOne({ _id: req.params.slug })
    .populate('children')
    .populate('parent')
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));

const insertChildrenIdToParent = childId =>
  parent => {
    if(parent) {
      parent.children.push(childId);
      parent.save();
    }
  };

const updateChildren = parentId =>
  child => {
    if(child) {
      if(parentId) {
        Category.findOne({ _id: parentId })
          .then(insertChildrenIdToParent(child.id));
      }
      return child;
    }
    return null;
  };


// Creates a new Category in the DB
export const create = (req, res) => {
  req.body.slug = util.slugify(req.body.name);

  return Category.create(req.body)
    .then(updateChildren(req.body.parent))
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
};

// Upserts the given Category in the DB at the specified ID
export const upsert = (req, res) => {
  if(req.body._id) {
    delete req.body._id;
  }
  return Category.findOneAndUpdate(
    { _id: req.params.slug },
    req.body,
    {
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true
    }
  )
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
};

// Updates an existing Category in the DB
export const patch = (req, res) => {
  if(req.body._id) {
    delete req.body._id;
    delete req.body.createdAt;
    delete req.body.updatedAt;
  }
  return Category.findOne({ _id: req.params.slug })
    .exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
};

// Deletes a Category from the DB
export const destroy = (req, res) =>
  Category.findOne({ _id: req.params.id })
    .exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
