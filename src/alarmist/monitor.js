import {
  MONITOR_LOG,
  READY_RESPONSE,
} from '../constants';
import {
  getControlSocket,
  getLogSocket,
} from './local-socket';
import {createServer} from 'net';
import _mkdirp from 'mkdirp';
import _rimraf from 'rimraf';
import path from 'path';
import promisify from '../utils/promisify';
import EventEmitter from 'events';
import {PassThrough} from 'stream';
import {createWriteStream} from 'fs';
import _ from 'lodash';

const mkdirp = promisify(_mkdirp);
const rimraf = promisify(_rimraf);

export async function createMonitor({reset, workingDir}) {
  const monitorLog = path.join(workingDir, MONITOR_LOG);
  const monitor = new EventEmitter();
  // istanbul ignore else
  if (reset) {
    await rimraf(workingDir);
    await mkdirp(workingDir);
  }
  // set up streams for logging the watcher process
  const log = new PassThrough();
  const logStream = createWriteStream(monitorLog);
  log.pipe(logStream);
  const logStreamEnded = new Promise(
      (resolve) => logStream.on('close', resolve)
  );
  const endLogStream = async () => {
    logStream.end();
    await logStreamEnded;
  };
  // set up the control socket for jobs
  const controlServer = createServer((client) => {
    client.once('data', (data) => {
      const start = JSON.parse(data);
      monitor.emit('run-start', start);
      client.once('data', (data) => {
        const end = JSON.parse(data);
        monitor.emit('run-end', Object.assign({}, start, end));
      });
      client.write(READY_RESPONSE);
    });
  });
  const controlListen = promisify(controlServer.listen.bind(controlServer));
  const controlClose = promisify(controlServer.close.bind(controlServer));
  const controlSocket = await getControlSocket(workingDir, true);
  await controlListen(controlSocket);
  // set up the log socket for jobs
  const logServer = createServer((client) => {
    client.once('data', (data) => {
      const begin = JSON.parse(data);
      client.on('data', (data) => {
        monitor.emit('run-log', Object.assign({}, begin, {
          data,
        }));
      });
      client.write(READY_RESPONSE);
    });
  });
  const logListen = promisify(logServer.listen.bind(logServer));
  const logClose = promisify(logServer.close.bind(logServer));
  const logSocket = await getLogSocket(workingDir, true);
  await logListen(logSocket);
  // expose the monitor properties and methods
  monitor.close = async () => {
    if (!_.isUndefined(monitor.cleanup)) {
      await monitor.cleanup();
    }
    await endLogStream();
    await controlClose();
    await logClose();
  };
  monitor.log = log;
  monitor.end = async (error) => {
    await endLogStream();
    monitor.emit('end', error);
  };
  return monitor;
}
