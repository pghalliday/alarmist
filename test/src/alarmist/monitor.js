import {createMonitor} from '../../../src/alarmist/monitor';
import {
  WORKING_DIR,
  STDOUT_LOG,
  STDERR_LOG,
  ALL_LOG,
  STATUS_FILE,
  STATUS_PENDING,
  STATUS_COMPLETE,
} from '../../../src/constants.js';
import path from 'path';
import _rimraf from 'rimraf';
import _mkdirp from 'mkdirp';
import {writeFile as _writeFile} from 'fs';
import promisify from '../../../src/utils/promisify';

const rimraf = promisify(_rimraf);
const mkdirp = promisify(_mkdirp);
const writeFile = promisify(_writeFile);

const name = 'name';
const startTime = 1000000;
const endTime = 2000000;
const id = 'jobId';
const exitCode = 0;
const stdout = Buffer.from('stdout');
const stderr = Buffer.from('stderr');
const all = Buffer.concat([stdout, stderr]);

const reportDir = path.join(
  WORKING_DIR,
  name,
  id,
);
const stdoutLog = path.join(reportDir, STDOUT_LOG);
const stderrLog = path.join(reportDir, STDERR_LOG);
const allLog = path.join(reportDir, ALL_LOG);
const statusFile = path.join(reportDir, STATUS_FILE);

describe('alarmist', () => {
  describe('createMonitor', () => {
    let startEvent;
    let completeEvent;
    before(async () => {
      await rimraf(WORKING_DIR);
      const monitor = await createMonitor();
      await mkdirp(reportDir);
      await new Promise((resolve) => {
        monitor.on('start', async (event) => {
          startEvent = event;
          await writeFile(stdoutLog, stdout);
          await writeFile(stderrLog, stderr);
          await writeFile(allLog, stdout + stderr);
          writeFile(statusFile, JSON.stringify({
            status: STATUS_COMPLETE,
            exitCode,
            startTime,
            endTime,
          }));
        });
        monitor.on('complete', (event) => {
          completeEvent = event;
          monitor.close();
          resolve();
        });
        writeFile(statusFile, JSON.stringify({
          status: STATUS_PENDING,
          startTime,
        }));
      });
    });

    it('should emit an event when a command is started', async () => {
      startEvent.should.eql({
        name,
        id,
        startTime,
      });
    });

    it('should emit an event when a command completes', async () => {
      completeEvent.should.eql({
        name,
        id,
        exitCode,
        startTime,
        endTime,
        stdout,
        stderr,
        all,
      });
    });
  });
});
