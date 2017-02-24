import {
  WORKING_DIR,
  ID_FILE,
  STATUS_FILE,
  STDOUT_LOG,
  STDERR_LOG,
  ALL_LOG,
  CONTROL_SOCKET,
  LOG_SOCKET,
} from '../constants';
import {createConnection} from 'net';
import _mkdirp from 'mkdirp';
import {
  writeFile as _writeFile,
  createWriteStream,
} from 'fs';
import path from 'path';
import promisify from '../utils/promisify';
import {PassThrough} from 'stream';
import _id from '../utils/id';

const mkdirp = promisify(_mkdirp);
const writeFile = promisify(_writeFile);

const controlSocket = path.join(WORKING_DIR, CONTROL_SOCKET);
const logSocket = path.join(WORKING_DIR, LOG_SOCKET);

export async function createJob({name}) {
  // set up the file reporting
  const jobDir = path.join(WORKING_DIR, name);
  const idFile = path.join(jobDir, ID_FILE);
  const id = await _id.getId(idFile);
  const reportDir = path.join(jobDir, '' + id);
  const statusFile = path.join(reportDir, STATUS_FILE);
  const startTime = Date.now();
  await mkdirp(reportDir);
  await writeFile(statusFile, JSON.stringify({
    startTime,
  }));
  const stdout = new PassThrough();
  const stderr = new PassThrough();
  const stdoutStream = createWriteStream(path.join(reportDir, STDOUT_LOG));
  const stderrStream = createWriteStream(path.join(reportDir, STDERR_LOG));
  const allStream = createWriteStream(path.join(reportDir, ALL_LOG));
  stdout.pipe(stdoutStream);
  stdout.pipe(allStream);
  stdout.pipe(process.stdout);
  stderr.pipe(stderrStream);
  stderr.pipe(allStream);
  stderr.pipe(process.stderr);
  const streamEndPromises = [
    new Promise((resolve) => stdoutStream.on('close', resolve)),
    new Promise((resolve) => stderrStream.on('close', resolve)),
    new Promise((resolve) => allStream.on('close', resolve)),
  ];
  // start the control socket
  const control = createConnection(controlSocket);
  const controlReady = new Promise((resolve) => control.once('data', resolve));
  const controlEnded = new Promise((resolve) => control.once('end', resolve));
  await new Promise((resolve) => control.once('connect', resolve));
  control.write(JSON.stringify({
    name,
    id,
    startTime,
  }));
  await controlReady;
  // start the log socket
  const log = createConnection(logSocket);
  const logReady = new Promise((resolve) => log.once('data', resolve));
  const logEnded = new Promise((resolve) => log.once('end', resolve));
  await new Promise((resolve) => log.once('connect', resolve));
  log.write(JSON.stringify({
    name,
    id,
  }));
  await logReady;
  stdout.pipe(log);
  stderr.pipe(log);
  // return the job
  return {
    stdout,
    stderr,
    exit: async (exitCode) => {
      const endTime = Date.now();
      stdout.end();
      stderr.end();
      await Promise.all(streamEndPromises);
      await writeFile(statusFile, JSON.stringify({
        exitCode,
        startTime,
        endTime,
      }));
      await logEnded;
      control.end(JSON.stringify({
        endTime,
        exitCode,
      }));
      await controlEnded;
    },
  };
}
