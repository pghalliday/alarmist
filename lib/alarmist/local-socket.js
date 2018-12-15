"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getControlSocket = getControlSocket;
exports.getLogSocket = getLogSocket;

var _promisify = _interopRequireDefault(require("../utils/promisify"));

var _fs = require("fs");

var _uuid = require("uuid");

var _path = _interopRequireDefault(require("path"));

var _constants = require("../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const preadFile = (0, _promisify.default)(_fs.readFile);
const pwriteFile = (0, _promisify.default)(_fs.writeFile); // istanbul ignore next

async function getSocket(server, file) {
  if (process.platform === 'win32') {
    // windows uses named pipes which have
    // a flat namespace so for the server
    // we will generate a pipe name
    // and for the client we will read the
    // pipe name
    if (server) {
      const namedPipe = `\\\\.\\pipe\\${(0, _uuid.v1)()}`;
      await pwriteFile(file, namedPipe);
      return namedPipe;
    } else {
      const namedPipe = await preadFile(file);
      return namedPipe.toString();
    }
  } else {
    // Otherwise use a unix socket
    return file;
  }
}

async function getControlSocket(workingDir, server) {
  const controlSocket = _path.default.join(workingDir, _constants.CONTROL_SOCKET);

  return await getSocket(server, controlSocket);
}

async function getLogSocket(workingDir, server) {
  const logSocket = _path.default.join(workingDir, _constants.LOG_SOCKET);

  return await getSocket(server, logSocket);
}