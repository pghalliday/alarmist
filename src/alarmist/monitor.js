import {
  WORKING_DIR,
  STATUS_FILE,
  STDOUT_LOG,
  STDERR_LOG,
  ALL_LOG,
} from '../constants';
import _mkdirp from 'mkdirp';
import _rimraf from 'rimraf';
import {
  readFile as _readFile,
} from 'fs';
import path from 'path';
import promisify from '../utils/promisify';
import chokidar from 'chokidar';
import EventEmitter from 'events';
import {PassThrough} from 'stream';
import {createWriteStream} from 'fs';
import _ from 'lodash';

const mkdirp = promisify(_mkdirp);
const rimraf = promisify(_rimraf);
const readFile = promisify(_readFile);

const workingDirRegExp = WORKING_DIR.replace('.', '\\.');
const statusFileRegExp = STATUS_FILE.replace('.', '\\.');
const statusPathRegExp = new RegExp(
  `${workingDirRegExp}/(.*)/(.*)/${statusFileRegExp}`
);

export async function createMonitor() {
  const monitor = new EventEmitter();
  await rimraf(WORKING_DIR);
  await mkdirp(WORKING_DIR);
  const emitJob = async (filePath) => {
    const match = statusPathRegExp.exec(filePath);
    const name = match[1];
    const id = match[2];
    const statusJson = await readFile(filePath);
    const status = JSON.parse(statusJson[0]);
    const event = Object.assign({}, status, {
      name,
      id,
    });
    monitor.emit('update', event);
  };
  const watcher = chokidar.watch(`${WORKING_DIR}/*/*/${STATUS_FILE}`)
  .on('add', emitJob)
  .on('change', emitJob);
  const stdout = new PassThrough();
  const stderr = new PassThrough();
  const stdoutStream = createWriteStream(path.join(WORKING_DIR, STDOUT_LOG));
  const stderrStream = createWriteStream(path.join(WORKING_DIR, STDERR_LOG));
  const allStream = createWriteStream(path.join(WORKING_DIR, ALL_LOG));
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
  monitor.close = async () => {
    if (!_.isUndefined(monitor.cleanup)) {
      await monitor.cleanup();
    }
    await endStreams();
    watcher.close();
  };
  monitor.stdout = stdout;
  monitor.stderr = stderr;
  monitor.exit = async (code) => {
    await endStreams();
    monitor.emit('exit', code);
  };
  await new Promise((resolve) => watcher.on('ready', resolve));
  return monitor;
}
