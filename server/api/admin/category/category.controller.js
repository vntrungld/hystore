/**
 * Using Rails-like standard naming convention for endpoints.
 * POST    /api/admin/categories        ->  create
 * PUT     /api/admin/categories/:id  ->  upsert
 * PATCH   /api/admin/categories/:id  ->  patch
 * DELETE  /api/admin/categories/:id  ->  destroy
 */

'use strict';
/* eslint prefer-reflect: 0 */

import jsonpatch from 'fast-json-patch';
import Category from '../../category/category.model';

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
      entity.status = 'delete';

      return entity.save()
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

function insertChildrenIdToParent(childId) {
  return function(parent) {
    if(parent) {
      parent.children.push(childId);
      return parent.save();
    }
  };
}

function updateChildren(parentId) {
  if(parentId) {
    return function(child) {
      if(child) {
        return Category.findById(parentId)
          .then(insertChildrenIdToParent(child._id));
      }
      return null;
    };
  }
}

// Creates a new Category in the DB
export function create(req, res) {
  return Category.create(req.body)
    .then(updateChildren(req.body.parent))
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Category in the DB at the specified ID
export const upsert = (req, res) => {
  if(req.body._id) {
    delete req.body._id;
  }
  return Category.findByIdAndUpdate(
    req.params.id,
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
  return Category.findById(req.params.id)
    .exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
};

// Deletes a Category from the DB
export const destroy = (req, res) =>
  Category.findById(req.params.id)
    .exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));

