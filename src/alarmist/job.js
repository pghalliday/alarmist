import {
  WORKING_DIR,
  ID_FILE,
  STATUS_FILE,
  PROCESS_LOG,
} from '../constants';
import {
  getControlSocket,
  getLogSocket,
} from './local-socket';
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
  const log = new PassThrough();
  const logStream = createWriteStream(path.join(reportDir, PROCESS_LOG));
  log.pipe(logStream);
  log.pipe(process.stdout);
  const logStreamEnded = new Promise(
    (resolve) => logStream.on('close', resolve)
  );
  // start the control socket
  const controlSocket = await getControlSocket(false);
  const controlConnection = createConnection(controlSocket);
  const controlReady = new Promise(
    (resolve) => controlConnection.once('data', resolve)
  );
  const controlEnded = new Promise(
    (resolve) => controlConnection.once('end', resolve)
  );
  await new Promise((resolve) => controlConnection.once('connect', resolve));
  controlConnection.write(JSON.stringify({
    name,
    id,
    startTime,
  }));
  await controlReady;
  // start the log socket
  const logSocket = await getLogSocket(false);
  const logConnection = createConnection(logSocket);
  const logReady = new Promise(
    (resolve) => logConnection.once('data', resolve)
  );
  const logEnded = new Promise(
    (resolve) => logConnection.once('end', resolve)
  );
  await new Promise((resolve) => logConnection.once('connect', resolve));
  logConnection.write(JSON.stringify({
    name,
    id,
  }));
  await logReady;
  log.pipe(logConnection);
  // return the job
  return {
    log,
    exit: async (exitCode) => {
      const endTime = Date.now();
      log.end();
      await logStreamEnded;
      await writeFile(statusFile, JSON.stringify({
        exitCode,
        startTime,
        endTime,
      }));
      await logEnded;
      controlConnection.end(JSON.stringify({
        endTime,
        exitCode,
      }));
      await controlEnded;
    },
  };
}
