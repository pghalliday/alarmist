import path from 'path';
import {
  WORKING_DIR,
  CONTROL_SOCKET,
  LOG_SOCKET,
  CONTROL_NAMED_PIPE,
  LOG_NAMED_PIPE,
} from '../constants';

const controlSocket = path.join(WORKING_DIR, CONTROL_SOCKET);
const logSocket = path.join(WORKING_DIR, LOG_SOCKET);

// istanbul ignore next
function getControlSocket() {
  if (process.platform === 'win32') {
    // windows uses named pipes
    return CONTROL_NAMED_PIPE;
  } else {
    // Otherwise use a unix socket
    return controlSocket;
  }
}

// istanbul ignore next
function getLogSocket() {
  if (process.platform === 'win32') {
    // windows uses named pipes
    return LOG_NAMED_PIPE;
  } else {
    // Otherwise use a unix socket
    return logSocket;
  }
}

export {
  getControlSocket,
  getLogSocket,
};
