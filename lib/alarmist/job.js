"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createJob = createJob;

var _constants = require("../constants");

var _localSocket = require("./local-socket");

var _net = require("net");

var _mkdirp2 = _interopRequireDefault(require("mkdirp"));

var _fs = require("fs");

var _path = _interopRequireDefault(require("path"));

var _promisify = _interopRequireDefault(require("../utils/promisify"));

var _stream = require("stream");

var _id2 = _interopRequireDefault(require("../utils/id"));

var _sanitizeFilename = _interopRequireDefault(require("sanitize-filename"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const mkdirp = (0, _promisify.default)(_mkdirp2.default);
const writeFile = (0, _promisify.default)(_fs.writeFile);

async function createJob({
  name,
  service,
  metric,
  workingDir
}) {
  // set up the file reporting
  const jobDir = _path.default.join(workingDir, _constants.JOBS_DIR, (0, _sanitizeFilename.default)(name, {
    replacement: '__'
  }));

  const idFile = _path.default.join(jobDir, _constants.ID_FILE);

  const id = await _id2.default.getId(idFile);

  const reportDir = _path.default.join(jobDir, '' + id);

  const statusFile = _path.default.join(reportDir, _constants.STATUS_FILE);

  const startTime = Date.now();
  await mkdirp(reportDir);
  await writeFile(statusFile, JSON.stringify({
    service,
    metric,
    startTime
  }));
  const log = new _stream.PassThrough();
  const logStream = (0, _fs.createWriteStream)(_path.default.join(reportDir, _constants.RUN_LOG));
  log.pipe(logStream);
  const logStreamEnded = new Promise(resolve => logStream.on('close', resolve)); // start the control socket

  const controlSocket = await (0, _localSocket.getControlSocket)(workingDir, false);
  const controlConnection = (0, _net.createConnection)(controlSocket);
  const controlReady = new Promise(resolve => controlConnection.once('data', resolve));
  const controlEnded = new Promise(resolve => controlConnection.once('end', resolve));
  await new Promise(resolve => controlConnection.once('connect', resolve));
  controlConnection.write(JSON.stringify({
    name,
    id,
    service,
    metric,
    startTime
  }));
  await controlReady; // start the log socket

  const logSocket = await (0, _localSocket.getLogSocket)(workingDir, false);
  const logConnection = (0, _net.createConnection)(logSocket);
  const logReady = new Promise(resolve => logConnection.once('data', resolve));
  const logEnded = new Promise(resolve => logConnection.once('end', resolve));
  await new Promise(resolve => logConnection.once('connect', resolve));
  logConnection.write(JSON.stringify({
    name,
    id
  }));
  await logReady;
  log.pipe(logConnection); // return the job

  return {
    log,
    end: async error => {
      const endTime = Date.now();
      log.end();
      await logStreamEnded;
      await writeFile(statusFile, JSON.stringify({
        service,
        metric,
        error: error,
        startTime,
        endTime
      }));
      await logEnded;
      controlConnection.end(JSON.stringify({
        error: error,
        endTime
      }));
      await controlEnded;
    }
  };
}