import {createMonitor} from '../../../src/alarmist/monitor';
import {
  WORKING_DIR,
  STDOUT_LOG,
  STDERR_LOG,
  ALL_LOG,
  STATUS_FILE,
} from '../../../src/constants.js';
import path from 'path';
import _rimraf from 'rimraf';
import _mkdirp from 'mkdirp';
import {readFile as _readFile, writeFile as _writeFile} from 'fs';
import promisify from '../../../src/utils/promisify';
import _ from 'lodash';

const rimraf = promisify(_rimraf);
const mkdirp = promisify(_mkdirp);
const writeFile = promisify(_writeFile);
const readFile = promisify(_readFile);

const name = 'name';
const id = 'jobId';
const exitCode = 0;
const stdout = Buffer.from('stdout');
const stderr = Buffer.from('stderr');
const all = Buffer.concat([stdout, stderr]);
const jobField1 = 'job field 1';
const jobField2 = 'job field 2';
const jobField3 = 'job field 3';

const jobDir = path.join(
  WORKING_DIR,
  name,
);
const reportDir = path.join(
  jobDir,
  id,
);
const statusFile = path.join(reportDir, STATUS_FILE);

const monitorStdoutLog = path.join(WORKING_DIR, STDOUT_LOG);
const monitorStderrLog = path.join(WORKING_DIR, STDERR_LOG);
const monitorAllLog = path.join(WORKING_DIR, ALL_LOG);

describe('alarmist', () => {
  describe('createMonitor', () => {
    let monitor;
    let jobEvent;
    beforeEach(async () => {
      console.log('1');
      await rimraf(WORKING_DIR);
      console.log('2');
      monitor = await createMonitor();
      console.log('3');
      await mkdirp(jobDir);
      console.log('3.5');
      await mkdirp(reportDir);
      console.log('4');
      await new Promise((resolve) => {
        monitor.on('job', (event) => {
          jobEvent = event;
          resolve();
        });
        console.log(statusFile);
        writeFile(statusFile, JSON.stringify({
          jobField1,
          jobField2,
          jobField3,
        }));
      });
      console.log('5');
    });

    it('should open a stdout stream', async () => {
      monitor.stdout.should.be.ok;
      await monitor.close();
    });

    it('should open a stderr stream', async () => {
      monitor.stderr.should.be.ok;
      await monitor.close();
    });

    it('should emit events when jobs are updated', async () => {
      jobEvent.should.eql({
        name,
        id,
        jobField1,
        jobField2,
        jobField3,
      });
      await monitor.close();
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
        await monitor.close();
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
        beforeEach(async () => {
          monitor.stdout.write(stdout);
          monitor.stderr.write(stderr);
          await monitor.close();
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
