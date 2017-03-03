import {
  createJob,
} from '../../../src/alarmist/job';
import {
  WORKING_DIR,
  JOBS_DIR,
  RUN_LOG,
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

const rimraf = promisify(_rimraf);
const mkdirp = promisify(_mkdirp);
const readFile = promisify(_readFile);

const name = 'name';
const startTime = 1000000;
const endTime = 2000000;
const successId = 1;
const failId = 2;
const log = Buffer.from('log');

const successReportDir = path.join(
  WORKING_DIR,
  JOBS_DIR,
  name,
  '' + successId,
);
const successRunLog = path.join(successReportDir, RUN_LOG);
const successStatusFile = path.join(successReportDir, STATUS_FILE);

const failReportDir = path.join(
  WORKING_DIR,
  JOBS_DIR,
  name,
  '' + failId,
);
const failRunLog = path.join(failReportDir, RUN_LOG);
const failStatusFile = path.join(failReportDir, STATUS_FILE);

let successJob;
let failJob;
let controlServer;
let logServer;
let successStart;
let successEnd;
let failStart;
let failEnd;
let successBegin;
let successLogData;
let failBegin;
let failLogData;

describe('alarmist', () => {
  describe('job', () => {
    before(async () => {
      sinon.stub(Date, 'now', () => startTime);
      await rimraf(WORKING_DIR);
      await mkdirp(WORKING_DIR);
      controlServer = createServer((client) => {
        client.once('data', (data) => {
          const start = JSON.parse(data);
          if (start.id === successId) {
            successStart = start;
            client.once('data', (data) => {
              successEnd = JSON.parse(data);
            });
          } else if (start.id === failId) {
            failStart = start;
            client.once('data', (data) => {
              failEnd = JSON.parse(data);
            });
          }
          client.write(READY_RESPONSE);
        });
      });
      await new Promise(
        async (resolve) => controlServer.listen(
          await getControlSocket(true),
          resolve,
        )
      );
      logServer = createServer((client) => {
        client.once('data', (data) => {
          successLogData = Buffer.alloc(0);
          failLogData = Buffer.alloc(0);
          const begin = JSON.parse(data);
          if (begin.id === successId) {
            successBegin = begin;
            client.on('data', (data) => {
              successLogData = Buffer.concat([successLogData, data]);
            });
          } else if (begin.id === failId) {
            failBegin = begin;
            client.on('data', (data) => {
              failLogData = Buffer.concat([failLogData, data]);
            });
          }
          client.write(READY_RESPONSE);
        });
      });
      await new Promise(
        async (resolve) => logServer.listen(
          await getLogSocket(true),
          resolve,
        )
      );
      sinon.stub(_id, 'getId', async () => Promise.resolve(successId));
      successJob = await createJob(name);
      _id.getId.restore();
      sinon.stub(_id, 'getId', async () => Promise.resolve(failId));
      failJob = await createJob(name);
      _id.getId.restore();
      Date.now.restore();
    });

    after(async () => {
      await new Promise((resolve) => controlServer.close(resolve));
      await new Promise((resolve) => logServer.close(resolve));
    });

    it('should open a log stream', () => {
      successJob.log.should.be.ok;
      failJob.log.should.be.ok;
    });

    it('should save the status', async () => {
      let status = await readFile(successStatusFile);
      JSON.parse(status[0]).should.eql({
        startTime,
      });
      status = await readFile(failStatusFile);
      JSON.parse(status[0]).should.eql({
        startTime,
      });
    });

    it('should report start', async () => {
      successStart.should.eql({
        name,
        id: successId,
        startTime,
      });
      failStart.should.eql({
        name,
        id: failId,
        startTime,
      });
    });

    it('should begin the log', async () => {
      successBegin.should.eql({
        name,
        id: successId,
      });
      failBegin.should.eql({
        name,
        id: failId,
      });
    });

    describe('#end', () => {
      describe('without error', () => {
        before(async () => {
          sinon.stub(Date, 'now', () => endTime);
          try {
            successJob.log.write(log);
            await successJob.end();
          } catch (error) {
            throw(error);
          } finally {
            Date.now.restore();
          }
        });

        it('should write the process log', async () => {
          const _log = await readFile(successRunLog);
          _log[0].should.eql(log);
        });

        it('should save the status', async () => {
          const status = await readFile(successStatusFile);
          JSON.parse(status[0]).should.eql({
            endTime,
            startTime,
          });
        });

        it('should transmit the log', () => {
          successLogData.should.eql(log);
        });

        it('should report end', () => {
          successEnd.should.eql({
            endTime,
          });
        });
      });

      describe('with error', () => {
        before(async () => {
          sinon.stub(Date, 'now', () => endTime);
          try {
            failJob.log.write(log);
            await failJob.end('message');
          } catch (error) {
            throw(error);
          } finally {
            Date.now.restore();
          }
        });

        it('should write the process log', async () => {
          const _log = await readFile(failRunLog);
          _log[0].should.eql(log);
        });

        it('should save the status', async () => {
          const status = await readFile(failStatusFile);
          JSON.parse(status[0]).should.eql({
            endTime,
            startTime,
            error: 'message',
          });
        });

        it('should transmit the log', () => {
          failLogData.should.eql(log);
        });

        it('should report end', () => {
          failEnd.should.eql({
            endTime,
            error: 'message',
          });
        });
      });
    });
  });
});
