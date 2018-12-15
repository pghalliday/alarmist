"use strict";

var _lockfile = require("lockfile");

var _fs = require("fs");

var _promisify = _interopRequireDefault(require("./promisify"));

var _path = require("path");

var _mkdirp2 = _interopRequireDefault(require("mkdirp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const lock = (0, _promisify.default)(_lockfile.lock);
const unlock = (0, _promisify.default)(_lockfile.unlock);
const readFile = (0, _promisify.default)(_fs.readFile);
const writeFile = (0, _promisify.default)(_fs.writeFile);
const mkdirp = (0, _promisify.default)(_mkdirp2.default);

async function getId(file) {
  const lockFile = file + '.lock';
  await mkdirp((0, _path.dirname)(file));
  await lock(lockFile, {
    wait: 2000
  });
  let id = 0;

  try {
    id = parseInt((await readFile(file)));
  } catch (_error) {// assume the file does not exist yet
    // and do nothing
  }

  id++;
  await writeFile(file, id + '');
  await unlock(lockFile);
  return id;
}

module.exports = {
  getId
};