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
  CONTROL_SOCKET,
  LOG_SOCKET,
} from '../constants';

const preadFile = promisify(readFile);
const pwriteFile = promisify(writeFile);

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

async function getControlSocket(workingDir, server) {
  const controlSocket = path.join(workingDir, CONTROL_SOCKET);
  return await getSocket(server, controlSocket);
}

async function getLogSocket(workingDir, server) {
  const logSocket = path.join(workingDir, LOG_SOCKET);
  return await getSocket(server, logSocket);
}

export {
  getControlSocket,
  getLogSocket,
};
