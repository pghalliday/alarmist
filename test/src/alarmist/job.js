import {
  createJob,
} from '../../../src/alarmist/job';
import {
  WORKING_DIR,
  PROCESS_LOG,
  STATUS_FILE,
  READY_RESPONSE,
} from '../../../src/constants.js';
import {
  getControlSocket,
  getLogSocket,
} from '../../../src/alarmist/local-socket';
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
const log = Buffer.from('log');
const emptyBuffer = Buffer.alloc(0);

const reportDir = path.join(
  WORKING_DIR,
  name,
  '' + id,
);
const processLog = path.join(reportDir, PROCESS_LOG);
const statusFile = path.join(reportDir, STATUS_FILE);

describe('alarmist', () => {
  describe('createJob', () => {
    let job;
    let controlServer;
    let logServer;
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
      controlServer = createServer((client) => {
        client.once('data', (data) => {
          start = JSON.parse(data);
          client.once('data', (data) => {
            end = JSON.parse(data);
          });
          client.write(READY_RESPONSE);
        });
      });
      await new Promise(
        (resolve) => controlServer.listen(getControlSocket(), resolve)
      );
      logServer = createServer((client) => {
        client.once('data', (data) => {
          logData = Buffer.alloc(0);
          begin = JSON.parse(data);
          client.on('data', (data) => {
            logData = Buffer.concat([logData, data]);
          });
          client.write(READY_RESPONSE);
        });
      });
      await new Promise((resolve) => logServer.listen(getLogSocket(), resolve));
      job = await createJob({
        name,
      });
      Date.now = fnNow;
      _id.getId = fnGetId;
    });

    after(async () => {
      await new Promise((resolve) => controlServer.close(resolve));
      await new Promise((resolve) => logServer.close(resolve));
    });

    it('should open a log stream', () => {
      job.log.should.be.ok;
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
          job.log.write(log);
          await job.exit(exitCode);
          [processStdout, processStderr] = flush();
        } catch (error) {
          throw(error);
        } finally {
          Date.now = fnNow;
          restore();
        }
      });

      it('should write log to stdout', async () => {
        processStdout.should.eql(log);
      });

      it('should write nothing to stderr', async () => {
        processStderr.should.eql(emptyBuffer);
      });

      it('should write the process log', async () => {
        const _log = await readFile(processLog);
        _log[0].should.eql(log);
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
        logData.should.eql(log);
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
