import {
  WORKING_DIR,
  STATUS_FILE,
  STDOUT_LOG,
  STDERR_LOG,
  ALL_LOG,
  STATUS_PENDING,
  STATUS_COMPLETE,
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
  return new Promise((resolve) => {
    const watcher = chokidar.watch(`${WORKING_DIR}/**`)
    .on('ready', resolve.bind(null, monitor))
    .on('all', async (event, filePath) => {
      if (event === 'add' || event === 'change') {
        const match = statusPathRegExp.exec(filePath);
        if (match) {
          const name = match[1];
          const id = match[2];
          const statusJson = await readFile(filePath);
          const status = JSON.parse(statusJson[0]);
          switch (status.status) {
            case STATUS_PENDING:
              monitor.emit('start', {
                name,
                id,
                startTime: status.startTime,
              });
              break;
            case STATUS_COMPLETE:
              const reportDir = path.join(WORKING_DIR, name, id);
              const stdout = await readFile(path.join(reportDir, STDOUT_LOG));
              const stderr = await readFile(path.join(reportDir, STDERR_LOG));
              const all = await readFile(path.join(reportDir, ALL_LOG));
              monitor.emit('complete', {
                name,
                id,
                exitCode: status.exitCode,
                startTime: status.startTime,
                endTime: status.endTime,
                stdout: stdout[0],
                stderr: stderr[0],
                all: all[0],
              });
              break;
          }
        }
      }
    });
    monitor.close = () => watcher.close();
  });
}
