"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMonitor = createMonitor;

var _constants = require("../constants");

var _localSocket = require("./local-socket");

var _net = require("net");

var _mkdirp2 = _interopRequireDefault(require("mkdirp"));

var _rimraf2 = _interopRequireDefault(require("rimraf"));

var _path = _interopRequireDefault(require("path"));

var _promisify = _interopRequireDefault(require("../utils/promisify"));

var _events = _interopRequireDefault(require("events"));

var _stream = require("stream");

var _fs = require("fs");

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const mkdirp = (0, _promisify.default)(_mkdirp2.default);
const rimraf = (0, _promisify.default)(_rimraf2.default);

async function createMonitor({
  reset,
  workingDir
}) {
  const monitorLog = _path.default.join(workingDir, _constants.MONITOR_LOG);

  const monitor = new _events.default(); // istanbul ignore else

  if (reset) {
    await rimraf(workingDir);
    await mkdirp(workingDir);
  } // set up streams for logging the watcher process


  const log = new _stream.PassThrough();
  const logStream = (0, _fs.createWriteStream)(monitorLog);
  log.pipe(logStream);
  const logStreamEnded = new Promise(resolve => logStream.on('close', resolve));

  const endLogStream = async () => {
    logStream.end();
    await logStreamEnded;
  }; // set up the control socket for jobs


  const controlServer = (0, _net.createServer)(client => {
    client.once('data', data => {
      const start = JSON.parse(data);
      monitor.emit('run-start', start);
      client.once('data', data => {
        const end = JSON.parse(data);
        monitor.emit('run-end', Object.assign({}, start, end));
      });
      client.write(_constants.READY_RESPONSE);
    });
  });
  const controlListen = (0, _promisify.default)(controlServer.listen.bind(controlServer));
  const controlClose = (0, _promisify.default)(controlServer.close.bind(controlServer));
  const controlSocket = await (0, _localSocket.getControlSocket)(workingDir, true);
  await controlListen(controlSocket); // set up the log socket for jobs

  const logServer = (0, _net.createServer)(client => {
    client.once('data', data => {
      const begin = JSON.parse(data);
      client.on('data', data => {
        monitor.emit('run-log', Object.assign({}, begin, {
          data
        }));
      });
      client.write(_constants.READY_RESPONSE);
    });
  });
  const logListen = (0, _promisify.default)(logServer.listen.bind(logServer));
  const logClose = (0, _promisify.default)(logServer.close.bind(logServer));
  const logSocket = await (0, _localSocket.getLogSocket)(workingDir, true);
  await logListen(logSocket); // expose the monitor properties and methods

  monitor.close = async () => {
    if (!_lodash.default.isUndefined(monitor.cleanup)) {
      await monitor.cleanup();
    }

    await endLogStream();
    await controlClose();
    await logClose();
  };

  monitor.log = log;

  monitor.end = async error => {
    await endLogStream();
    monitor.emit('end', error);
  };

  return monitor;
}