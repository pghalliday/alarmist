import * as Job from '../../../src/alarmist/job';
import {
  exec,
} from '../../../src/alarmist/job-exec.js';
import {Writable} from 'stream';
import {
  capture,
  flush,
  restore,
} from '../../helpers/std-streams';

const name = 'name';
const successCode = 0;
const failCode = 1;
const stdout = Buffer.from('stdout');
const stderr = Buffer.from('stderr');
const all = Buffer.concat([stdout, stderr]);
const command = 'node';
const successArgs = [
  'test/bin/command.js',
  stdout.toString(),
  stderr.toString(),
  successCode,
];
const failArgs = [
  'test/bin/command.js',
  stdout.toString(),
  stderr.toString(),
  failCode,
];

class TestWritable extends Writable {
  constructor(options) {
    super(options);
    this.buffer = Buffer.alloc(0);
  }
  _write(chunk, encoding, callback) {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    callback();
  }
}

let job;
let createJob;
let processStdout;
let processStderr;

describe('alarmist', () => {
  describe('execJob', () => {
    describe('with success', () => {
      before(async function() {
        // eslint-disable-next-line no-invalid-this
        this.timeout(5000);
        capture();
        job = {
          log: new TestWritable(),
          end: sinon.spy(() => Promise.resolve()),
        };
        createJob = sinon.spy(() => Promise.resolve(job));
        sinon.stub(Job, 'createJob', createJob);
        await exec({
          name,
          command,
          args: successArgs,
        });
        Job.createJob.restore();
        [processStdout, processStderr] = flush();
        restore();
      });

      it('should create a job', () => {
        createJob.should.have.been.calledWith(name);
      });

      it('should write to stdout', async () => {
        processStdout.should.eql(stdout);
      });

      it('should write to stderr', async () => {
        processStderr.should.eql(stderr);
      });

      it('should pipe to the job log', () => {
        job.log.buffer.toString().should.eql(all.toString());
      });

      it('should complete the job', () => {
        job.end.should.have.been.calledOnce;
      });
    });

    describe('with fail', () => {
      before(async function() {
        // eslint-disable-next-line no-invalid-this
        this.timeout(5000);
        capture();
        job = {
          log: new TestWritable(),
          end: sinon.spy(() => Promise.resolve()),
        };
        createJob = sinon.spy(() => Promise.resolve(job));
        sinon.stub(Job, 'createJob', createJob);
        await exec({
          name,
          command,
          args: failArgs,
        });
        Job.createJob.restore();
        [processStdout, processStderr] = flush();
        restore();
      });

      it('should create a job', () => {
        createJob.should.have.been.calledWith(name);
      });

      it('should write to stdout', async () => {
        processStdout.should.eql(stdout);
      });

      it('should write to stderr', async () => {
        processStderr.should.eql(stderr);
      });

      it('should pipe to the job log', () => {
        job.log.buffer.toString().should.eql(all.toString());
      });

      it('should complete the job', () => {
        job.end.should.have.been.calledWith(
          `exit code: ${failCode}`
        );
      });
    });
  });
});
