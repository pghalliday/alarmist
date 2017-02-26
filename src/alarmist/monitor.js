import {
  WORKING_DIR,
  STDOUT_LOG,
  STDERR_LOG,
  ALL_LOG,
  CONTROL_SOCKET,
  LOG_SOCKET,
  READY_RESPONSE,
} from '../constants';
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

const stdoutLog = path.join(WORKING_DIR, STDOUT_LOG);
const stderrLog = path.join(WORKING_DIR, STDERR_LOG);
const allLog = path.join(WORKING_DIR, ALL_LOG);
const controlSocket = path.join(WORKING_DIR, CONTROL_SOCKET);
const logSocket = path.join(WORKING_DIR, LOG_SOCKET);

export async function createMonitor() {
  const monitor = new EventEmitter();
  await rimraf(WORKING_DIR);
  await mkdirp(WORKING_DIR);
  // set up streams for logging the watcher process
  const stdout = new PassThrough();
  const stderr = new PassThrough();
  const stdoutStream = createWriteStream(stdoutLog);
  const stderrStream = createWriteStream(stderrLog);
  const allStream = createWriteStream(allLog);
  stdout.pipe(stdoutStream);
  stdout.pipe(allStream);
  stderr.pipe(stderrStream);
  stderr.pipe(allStream);
  const streamEndPromises = [
    new Promise((resolve) => stdoutStream.on('close', resolve)),
    new Promise((resolve) => stderrStream.on('close', resolve)),
    new Promise((resolve) => allStream.on('close', resolve)),
  ];
  const endStreams = async () => {
    stdout.end();
    stderr.end();
    await Promise.all(streamEndPromises);
  };
  // set up the control socket for jobs
  const control = createServer((client) => {
    client.once('data', (data) => {
      const start = JSON.parse(data);
      monitor.emit('start', start);
      client.once('data', (data) => {
        const end = JSON.parse(data);
        monitor.emit('end', Object.assign({}, start, end));
      });
      client.write(READY_RESPONSE);
    });
  });
  const controlListen = promisify(control.listen.bind(control));
  const controlClose = promisify(control.close.bind(control));
  await controlListen(controlSocket);
  // set up the log socket for jobs
  const log = createServer((client) => {
    client.once('data', (data) => {
      const begin = JSON.parse(data);
      client.on('data', (data) => {
        monitor.emit('log', Object.assign({}, begin, {
          data,
        }));
      });
      client.write(READY_RESPONSE);
    });
  });
  const logListen = promisify(log.listen.bind(log));
  const logClose = promisify(log.close.bind(log));
  await logListen(logSocket);
  // expose the monitor properties and methods
  monitor.close = async () => {
    if (!_.isUndefined(monitor.cleanup)) {
      await monitor.cleanup();
    }
    await endStreams();
    await controlClose();
    await logClose();
  };
  monitor.stdout = stdout;
  monitor.stderr = stderr;
  monitor.exit = async (code) => {
    await endStreams();
    monitor.emit('exit', code);
  };
  return monitor;
}
