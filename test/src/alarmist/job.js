import {
  createJob,
} from '../../../src/alarmist/job';
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
import {readFile as _readFile} from 'fs';
import promisify from '../../../src/utils/promisify';
import _id from '../../../src/utils/id';

const rimraf = promisify(_rimraf);
const readFile = promisify(_readFile);

const name = 'name';
const startTime = 1000000;
const endTime = 2000000;
const id = 'id';
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
  describe('createJob', () => {
    let job;
    before(async () => {
      const fnNow = Date.now;
      Date.now = () => startTime;
      const fnGetId = _id.getId;
      _id.getId = sinon.spy(() => id);
      await rimraf(WORKING_DIR);
      job = await createJob({
        name,
      });
      Date.now = fnNow;
      _id.getId = fnGetId;
    });

    it('should open a stdout stream', () => {
      job.stdout.should.be.ok;
    });

    it('should open a stderr stream', () => {
      job.stderr.should.be.ok;
    });

    it('should report pending', async () => {
      const status = await readFile(statusFile);
      JSON.parse(status[0]).should.eql({
        status: STATUS_PENDING,
        startTime,
      });
    });

    describe('#exit', () => {
      before(async () => {
        const fnNow = Date.now;
        Date.now = () => endTime;
        job.stdout.write(stdout);
        job.stderr.write(stderr);
        await job.exit(exitCode);
        Date.now = fnNow;
      });

      it('should write the stdout log', async () => {
        const _stdout = await readFile(stdoutLog);
        _stdout[0].should.eql(stdout);
      });

      it('should write the stderr log', async () => {
        const _stderr = await readFile(stderrLog);
        _stderr[0].should.eql(stderr);
      });

      it('should write the all log', async () => {
        const _all = await readFile(allLog);
        _all[0].should.eql(all);
      });

      it('should report complete', async () => {
        const status = await readFile(statusFile);
        JSON.parse(status[0]).should.eql({
          status: STATUS_COMPLETE,
          exitCode,
          endTime,
          startTime,
        });
      });
    });
  });
});
