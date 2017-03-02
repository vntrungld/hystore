/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/dev/applications                ->  index
 * POST    /api/dev/applications                ->  create
 * GET     /api/dev/applications/:id            ->  show
 * PUT     /api/dev/applications/:id            ->  update
 * PATCH   /api/dev/applications/:id            ->  patch
 * DELETE  /api/dev/applications/:id            ->  destroy
 */

'use strict';
/*eslint no-sync:0*/

import jsonpatch from 'fast-json-patch';
import Application from '../../application/application.model';
import mime from 'mime';
import AWS from 'aws-sdk';
import multer from 'multer';
import { slugify } from '../../../utilities';

const Promise = require('bluebird');

AWS.config.setPromisesDependency(Promise);

const s3 = new AWS.S3();
const AdmZip = require('adm-zip');
const fs = Promise.promisifyAll(require('fs'));
const config = require('../../../config/environment');
const path = config.path;
const s3Params = config.s3;
const uploadConfig = config.upload;
const storage = multer.diskStorage({
  destination(request, file, callback) {
    return callback(null, path);
  },
  filename(request, file, callback) {
    return callback(null, `${file.fieldname}-${Date.now()}.${mime.extension(file.mimetype)}`);
  }
});
const uploadFields = multer({ storage }).fields(uploadConfig);

function respondWithResult(res, statusCode = 200) {
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  if(Object.prototype.toString.call(patches) === '[object Object]') { // eslint-disable-line
    patches = [patches];
  }

  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true); // eslint-disable-line
    } catch(err) {
      return Promise.reject(err);
    }
    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      entity.status = 'delete';
      return entity.save()
        .then(function() {
          res.status(204).end();
        });
    }
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

function removeTemp(files) {
  return new Promise(function(resolve, reject) {
    for(let key in files) {
      const fileList = files[key];
      fileList.forEach(function(file) {
        try {
          fs.unlinkSync(`${path}${file.filename}`);
        } catch(err) {
          reject(err);
        }
      });
    }
    resolve('Delete files successfully');
  });
}

function isMatchIndexHTML(str) {
  const regx = /^(\w+\/)*index\.html$/g;
  return regx.test(str);
}

function isEntriesHaveIndexHTML(entries) {
  for(let i = 0; i < entries.length; i++) {
    if(isMatchIndexHTML(entries[i].entryName)) {
      return true;
    }
  }
  return false;
}

function uploadSingleFileToS3(prefix, file) {
  const filename = file.filename;
  const content = fs.readFileSync(path + filename);

  let params = s3Params;
  params.Key = prefix + filename;
  params.Body = content;

  return s3.upload(params).promise();
}

function uploadMultipleFileToS3(prefix, files) {
  let locations = [];

  return Promise.each(files, function(file) {
    return uploadSingleFileToS3(prefix, file)
      .then(function(data) {
        locations.push(data.Location);
      });
  })
    .then(function() {
      return locations;
    });
}

function convertToObjectWithUploadMultiple(prefix, subPrefix, files) {
  let result = {};
  for(let key in files) {
    let modPrefix = prefix;
    if(key === 'archive') {
      modPrefix = `${prefix}${subPrefix}/`;
    }
    result[key] = uploadMultipleFileToS3(modPrefix, files[key]);
  }
  return result;
}

// Gets a list of Applications
export function index(req, res) {
  return Application.find({
    $and: [
      { status: { $ne: 'delete' }},
      { author: req.user._id }
    ]
  })
    .populate('category')
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function storeToHardDisk(req, res, next) {
  console.log('store to hard disk');
  return uploadFields(req, res, function(err) {
    if(err) {
      return res.status(500).send(err)
        .end();
    }
    return next();
  });
}

export function fileValidate(req, res, next) {
  console.log('file validate');
  if(req.body._id) {
    const archivePath = `${path}${req.files.archive[0].filename}`;
    const zip = new AdmZip(archivePath);
    let zipEntries = zip.getEntries();

    if(isEntriesHaveIndexHTML(zipEntries)) {
      return next();
    } else {
      removeTemp(req.files)
        .catch(function(err) {
          console.log(err);
        });
      return res.status(400).end();
    }
  } else {
    return next();
  }
}

export function getSlug(req, res, next) {
  return Application.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(function(app) {
      req.slug = app.slug;
      next();
    })
    .catch(handleError(res));
}

export function upload(req, res, next) {
  console.log('upload to s3');
  const files = req.files;

  if(files) {
    let data = req.body;
    const email = req.user.email;
    const appSlug = req.slug || slugify(req.body.name);
    const major = data.major;
    const minor = data.minor;
    const maintenance = data.maintenance;
    const version = `v${major}.${minor}.${maintenance}`;
    const prefix = `${email}/${appSlug}/`;
    const objWithFunc = convertToObjectWithUploadMultiple(prefix, version, files);

    Promise.props(objWithFunc)
      .then(function(result) {
        return removeTemp(req.files)
          .then(function() {
            req.files = result;
            return next();
          })
          .catch(handleError(res));
      });
  } else {
    return next();
  }
}

// Gets a single Application from the DB
export function show(req, res) {
  return Application.findOne({
    author: req.user._id,
    _id: req.params.id
  })
    .populate('category')
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Application in the DB
export function create(req, res) {
  console.log('create app in db');
  const data = {
    author: req.user._id,
    name: req.body.name,
    icon: req.files.icon[0],
    feature: req.files.feature[0],
    screenshots: req.files.screenshots,
    versions: [{
      major: req.body.major,
      minor: req.body.minor,
      maintenance: req.body.maintenance,
      archive: req.files.archive[0]
    }],
    description: req.body.description,
    category: req.body.category
  };

  return Application.create(data)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Application in the DB at the specified ID
export function upsert(req, res) {
  const files = req.files;
  const data = req.body;
  if(files) {
    for(let key in files) {
      if(files[key].length === 1) {
        data[key] = files[key][0];
      } else {
        data[key] = files[key];
      }
    }
  }

  return Application.findByIdAndUpdate(req.params.id, data).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function handlePatchObjectRequest(req, res, next) {
  if(Object.prototype.toString.call(req.body) === '[object Object]') { // eslint-disable-line
    req.body = [req.body];
  }
  return next();
}

export function handlePatchVersionRequest(req, res, next) {
  const version = req.body[0].value;

  if(typeof version !== 'undefined') {
    req.body.major = version.major;
    req.body.minor = version.minor;
    req.body.maintenance = version.maintenance;
  }

  return next();
}

// Updates an existing Application in the DB
export function patch(req, res) {
  const files = req.files;

  if(req.body._id) {
    delete req.body._id; // eslint-disable-line
  }

  if(files) {
    req.body[0].value.archive = files.archive[0];
  }

  return Application.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Application from the DB
export function destroy(req, res) {
  return Application.findOne({
    $and: [
      { status: { $ne: 'delete' } },
      { _id: req.params.id }
    ]
  }).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
