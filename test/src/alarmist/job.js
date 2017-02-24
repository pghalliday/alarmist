import {
  createJob,
} from '../../../src/alarmist/job';
import {
  WORKING_DIR,
  STDOUT_LOG,
  STDERR_LOG,
  ALL_LOG,
  STATUS_FILE,
  CONTROL_SOCKET,
  LOG_SOCKET,
  READY_RESPONSE,
} from '../../../src/constants.js';
import {createServer} from 'net';
import path from 'path';
import _rimraf from 'rimraf';
import _mkdirp from 'mkdirp';
import {readFile as _readFile} from 'fs';
import promisify from '../../../src/utils/promisify';
import _id from '../../../src/utils/id';
import {
  capture,
  flush,
  restore,
} from '../../helpers/std-streams';

const rimraf = promisify(_rimraf);
const mkdirp = promisify(_mkdirp);
const readFile = promisify(_readFile);

const name = 'name';
const startTime = 1000000;
const endTime = 2000000;
const id = 1;
const exitCode = 0;
const stdout = Buffer.from('stdout');
const stderr = Buffer.from('stderr');
const all = Buffer.concat([stdout, stderr]);

const reportDir = path.join(
  WORKING_DIR,
  name,
  '' + id,
);
const stdoutLog = path.join(reportDir, STDOUT_LOG);
const stderrLog = path.join(reportDir, STDERR_LOG);
const allLog = path.join(reportDir, ALL_LOG);
const statusFile = path.join(reportDir, STATUS_FILE);
const controlSocket = path.join(WORKING_DIR, CONTROL_SOCKET);
const logSocket = path.join(WORKING_DIR, LOG_SOCKET);

describe('alarmist', () => {
  describe('createJob', () => {
    let job;
    let control;
    let log;
    let start;
    let end;
    let begin;
    let logData;
    before(async () => {
      const fnNow = Date.now;
      Date.now = () => startTime;
      const fnGetId = _id.getId;
      _id.getId = sinon.spy(() => id);
      await rimraf(WORKING_DIR);
      await mkdirp(WORKING_DIR);
      control = createServer((client) => {
        client.once('data', (data) => {
          start = JSON.parse(data);
          client.once('data', (data) => {
            end = JSON.parse(data);
          });
          client.write(READY_RESPONSE);
        });
      });
      await new Promise((resolve) => control.listen(controlSocket, resolve));
      log = createServer((client) => {
        client.once('data', (data) => {
          logData = Buffer.alloc(0);
          begin = JSON.parse(data);
          client.on('data', (data) => {
            logData = Buffer.concat([logData, data]);
          });
          client.write(READY_RESPONSE);
        });
      });
      await new Promise((resolve) => log.listen(logSocket, resolve));
      job = await createJob({
        name,
      });
      Date.now = fnNow;
      _id.getId = fnGetId;
    });

    after(async () => {
      await new Promise((resolve) => control.close(resolve));
      await new Promise((resolve) => log.close(resolve));
    });

    it('should open a stdout stream', () => {
      job.stdout.should.be.ok;
    });

    it('should open a stderr stream', () => {
      job.stderr.should.be.ok;
    });

    it('should save the status', async () => {
      const status = await readFile(statusFile);
      JSON.parse(status[0]).should.eql({
        startTime,
      });
    });

    it('should report start', async () => {
      start.should.eql({
        name,
        id,
        startTime,
      });
    });

    it('should begin the log', async () => {
      begin.should.eql({
        name,
        id,
      });
    });

    describe('#exit', () => {
      let processStdout;
      let processStderr;
      before(async () => {
        const fnNow = Date.now;
        Date.now = () => endTime;
        capture();
        try {
          job.stdout.write(stdout);
          job.stderr.write(stderr);
          await job.exit(exitCode);
          [processStdout, processStderr] = flush();
        } catch (error) {
          throw(error);
        } finally {
          Date.now = fnNow;
          restore();
        }
      });

      it('should write stdout to the console', async () => {
        processStdout.should.eql(stdout);
      });

      it('should write the stdout log', async () => {
        const _stdout = await readFile(stdoutLog);
        _stdout[0].should.eql(stdout);
      });

      it('should write stderr to the console', async () => {
        processStderr.should.eql(stderr);
      });

      it('should write the stderr log', async () => {
        const _stderr = await readFile(stderrLog);
        _stderr[0].should.eql(stderr);
      });

      it('should write the all log', async () => {
        const _all = await readFile(allLog);
        _all[0].should.eql(all);
      });

      it('should save the status', async () => {
        const status = await readFile(statusFile);
        JSON.parse(status[0]).should.eql({
          exitCode,
          endTime,
          startTime,
        });
      });

      it('should transmit the log', () => {
        logData.should.eql(all);
      });

      it('should report end', () => {
        end.should.eql({
          endTime,
          exitCode,
        });
      });
    });
  });
});
