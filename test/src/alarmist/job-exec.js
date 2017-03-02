import * as Job from '../../../src/alarmist/job';
import {
  exec,
} from '../../../src/alarmist/job-exec.js';
import {Writable} from 'stream';

const name = 'name';
const exitCode = 0;
const stdout = Buffer.from('stdout');
const stderr = Buffer.from('stderr');
const all = Buffer.concat([stdout, stderr]);
const command = 'node';
const args = [
  'test/bin/command.js',
  stdout.toString(),
  stderr.toString(),
  exitCode,
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

describe('alarmist', () => {
  describe('execJob', () => {
    let job;
    let createJob;
    before(async function() {
      // eslint-disable-next-line no-invalid-this
      this.timeout(5000);
      job = {
        log: new TestWritable(),
        exit: sinon.spy(() => Promise.resolve()),
      };
      createJob = sinon.spy(() => Promise.resolve(job));
      sinon.stub(Job, 'createJob', createJob);
      await exec({
        name,
        command,
        args,
      });
      Job.createJob.restore();
    });

    it('should create a job', () => {
      createJob.should.have.been.calledWith(name);
    });

    it('should pipe to the job log', () => {
      job.log.buffer.toString().should.eql(all.toString());
    });

    it('should complete the job', () => {
      job.exit.should.have.been.calledWith(exitCode);
    });
  });
});
