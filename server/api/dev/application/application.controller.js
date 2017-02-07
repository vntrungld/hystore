/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/dev/applications                ->  index
 * POST    /api/dev/applications                ->  create
 * GET     /api/dev/applications/:slug          ->  show
 * PUT     /api/dev/applications/:slug          ->  update
 * PATCH   /api/dev/applications/:slug          ->  patch
 * DELETE  /api/dev/applications/:slug          ->  destroy
 */

'use strict';
/*eslint no-sync:0*/

import Application from '../../application/application.model';
import Category from '../../category/category.model';
import mime from 'mime';
import { slugify } from '../../../utilities';
import AWS from 'aws-sdk';
import multer from 'multer';

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

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    for(let key in patches) {
      if(entity[key]) {
        entity[key] = patches[key];
      }
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

function insertVersion(newVer, current = false) {
  return function(entity) {
    entity.versions.push(newVer);
    if(current) {
      entity.currentVersionIndex++;
    }
    return entity.save();
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
  console.log('Store file to hard disk');
  return uploadFields(req, res, function(err) {
    if(err) {
      return res.status(500).send(err)
        .end();
    }
    return next();
  });
}

export function fileValidate(req, res, next) {
  console.log('File validate');
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
}

export function upload(req, res, next) {
  console.log('Upload to s3');
  const email = req.user.email;
  const appSlug = req.app.slug;
  const version = `v${req.body.major}.${req.body.minor}.${req.body.maintenance}`;
  const files = req.files;
  const prefix = `${email}/${appSlug}/`;
  const objWithFunc = convertToObjectWithUploadMultiple(prefix, version, files);
  Promise.props(objWithFunc)
    .then(function(result) {
      return removeTemp(req.files)
        .then(function() {
          req.files = result;
          return next();
        })
        .catch(function(err) {
          console.log(err);
        });
    });
}

// Gets a single Application from the DB
export function show(req, res) {
  return Application.findOne({
    author: req.user._id,
    slug: req.params.slug
  })
    .populate('category')
    .exec()
    .then(handleEntityNotFound(res))
    .then(function(app) {
      return app.dev;
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Application in the DB
export function createWithNoUrl(req, res, next) {
  console.log('create new application to database');
  const categorySlug = req.body.category.slug;
  return Category.findOne({ slug: categorySlug }).exec()
    .then(function(cat) {
      const fakeLink = 'unknown';
      const data = {
        author: req.user._id,
        name: req.body.name,
        slug: slugify(req.body.name),
        icon: fakeLink,
        feature: fakeLink,
        screenshots: [
          fakeLink,
          fakeLink,
          fakeLink
        ],
        versions: [
          {
            major: 0,
            minor: 0,
            maintenance: 0,
            archive: fakeLink
          }
        ],
        description: req.body.description,
        category: cat._id
      };

      console.log(data);

      return Application.create(data)
        .then(function(app) {
          req.app = app;
          return next();
        })
        .catch(handleError(res));
    })
    .catch(handleError(res));
}

export function updateUrlAfterCreate(req, res) {
  let app = req.app;
  const appId = app._id;
  const files = req.files;
  app.versions[0].archive = files.archive[0];
  app.icon = files.icon[0];
  app.feature = files.feature[0];
  app.screenshots = files.screenshots;

  return Application.findOneAndUpdate({ _id: appId }, app)
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Upserts the given Application in the DB at the specified ID
export function upsert(req, res) {
  return Application.findOne({ slug: req.params.slug }).exec()
    .then(insertVersion(req.body, req.query.current))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Application in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id; // eslint-disable-line
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
      { slug: req.params.slug }
    ]
  }).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
