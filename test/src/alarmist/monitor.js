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
import {readFile as _readFile, writeFile as _writeFile} from 'fs';
import promisify from '../../../src/utils/promisify';

const rimraf = promisify(_rimraf);
const mkdirp = promisify(_mkdirp);
const writeFile = promisify(_writeFile);
const readFile = promisify(_readFile);

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

const monitorStdoutLog = path.join(WORKING_DIR, STDOUT_LOG);
const monitorStderrLog = path.join(WORKING_DIR, STDERR_LOG);
const monitorAllLog = path.join(WORKING_DIR, ALL_LOG);

describe('alarmist', () => {
  describe('createMonitor', () => {
    let monitor;
    let startEvent;
    let completeEvent;
    beforeEach(async () => {
      await rimraf(WORKING_DIR);
      monitor = await createMonitor();
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
        monitor.on('complete', async (event) => {
          completeEvent = event;
          resolve();
        });
        writeFile(statusFile, JSON.stringify({
          status: STATUS_PENDING,
          startTime,
        }));
      });
    });

    it('should open a stdout stream', () => {
      monitor.stdout.should.be.ok;
    });

    it('should open a stderr stream', () => {
      monitor.stderr.should.be.ok;
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

    describe('#exit', () => {
      let exitEvent;
      beforeEach(async () => {
        await new Promise((resolve) => {
          monitor.on('exit', (event) => {
            exitEvent = event;
            monitor.cleanup = sinon.spy(() => Promise.resolve());
            monitor.close();
            resolve();
          });
          monitor.stdout.write(stdout);
          monitor.stderr.write(stderr);
          monitor.exit(exitCode);
        });
      });

      it('should write the stdout log', async () => {
        const _stdout = await readFile(monitorStdoutLog);
        _stdout[0].should.eql(stdout);
      });

      it('should write the stderr log', async () => {
        const _stderr = await readFile(monitorStderrLog);
        _stderr[0].should.eql(stderr);
      });

      it('should write the all log', async () => {
        const _all = await readFile(monitorAllLog);
        _all[0].should.eql(all);
      });

      it('should emit an exit event', async () => {
        exitEvent.should.eql(exitCode);
      });
    });

    describe('#close', () => {
      describe('without a cleanup method', () => {
        it('should be ok', async () => {
          await monitor.close();
        });
      });

      describe('with a cleanup method', () => {
        beforeEach(async () => {
          monitor.cleanup = sinon.spy(() => Promise.resolve());
          await monitor.close();
        });

        it('should call the cleanup method', async () => {
          monitor.cleanup.should.have.been.calledOnce;
        });
      });
    });
  });
});
