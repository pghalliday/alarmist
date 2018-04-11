'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = modulePath;

var _path = require('path');

function modulePath(filePath) {
  if (filePath.startsWith('.')) {
    return (0, _path.resolve)(filePath);
  } else {
    return filePath;
  }
}