import promisify from '../utils/promisify';
import {
  readFile,
  writeFile,
} from 'fs';
import {
  v1 as uuid,
} from 'uuid';
import path from 'path';
import {
  WORKING_DIR,
  CONTROL_SOCKET,
  LOG_SOCKET,
} from '../constants';

const preadFile = promisify(readFile);
const pwriteFile = promisify(writeFile);
const controlSocket = path.join(WORKING_DIR, CONTROL_SOCKET);
const logSocket = path.join(WORKING_DIR, LOG_SOCKET);

// istanbul ignore next
async function getSocket(server, file) {
  if (process.platform === 'win32') {
    // windows uses named pipes which have
    // a flat namespace so for the server
    // we will generate a pipe name
    // and for the client we will read the
    // pipe name
    if (server) {
      const namedPipe = `\\\\.\\pipe\\${uuid()}`;
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

async function getControlSocket(server) {
  return await getSocket(server, controlSocket);
}

async function getLogSocket(server) {
  return await getSocket(server, logSocket);
}

export {
  getControlSocket,
  getLogSocket,
};
