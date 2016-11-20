/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/file/:id          ->  download
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import multer from 'multer';
import mime from 'mime';

const config = require('../../config/environment');
const path = config.path;

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, path);
  },
  filename: (request, file, callback) => {
    const slugFileName = slugify(file.originalname);

    callback(null, `${file.fieldname}-${slugFileName}-${Date.now()}.${mime.extension(file.mimetype)}`);
  }
});

const uploadConfig = [{
  name: 'archive',
  maxCount: 1
}, {
  name: 'icon',
  maxCount: 1
}, {
  name: 'feature',
  maxCount: 1
}, {
  name: 'screenshots',
  maxCount: 8
}]

const uploadFields = multer({ storage }).fields(uploadConfig);

const slugify = text => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

export const upload = (req, res, next) => {
  uploadFields(req, res, err => {
    if (err) {
      return res.status(500).send(err).end();
    } return next();
  });
}

export const download = (req, res) => {
  return res.download(`${path}${req.params.filename}`);
}
