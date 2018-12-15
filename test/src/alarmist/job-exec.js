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
import promisify from '../../../src/utils/promisify';
import rimraf from 'rimraf';
import mkdirp from 'mkdirp';
import {
  readFile,
} from 'fs';
import {
  FORCE_COLOR_VAR,
} from '../../../src/constants';
import {
  WORKING_DIR,
} from '../../helpers/constants';
import path from 'path';

const primraf = promisify(rimraf);
const pmkdirp = promisify(mkdirp);
const preadFile = promisify(readFile);

const name = 'name';
const workingDir = 'working dir';
const color = false;
const service = true;
const metric = true;
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
let processStdout;
let processStderr;

describe('alarmist', () => {
  describe('execJob', () => {
    describe('with success', () => {
      before(async function() {
        // eslint-disable-next-line no-invalid-this
        this.timeout(5000);
        await primraf(WORKING_DIR);
        await pmkdirp(WORKING_DIR);
        capture();
        job = {
          log: new TestWritable(),
          end: sinon.spy(() => Promise.resolve()),
        };
        sinon.stub(Job, 'createJob').callsFake(
            sinon.spy(() => Promise.resolve(job))
        );
        await exec({
          name,
          command,
          args: successArgs,
          workingDir,
          color,
          service,
          metric,
        });
        [processStdout, processStderr] = flush();
      });
      after(() => {
        Job.createJob.restore();
        restore();
      });

      it('should create a job', () => {
        Job.createJob.should.have.been.calledWith({
          name,
          workingDir,
          service,
          metric,
        });
      });

      it('should set the FORCE_COLOR variable', async () => {
        const envVar = await preadFile(path.join(WORKING_DIR, FORCE_COLOR_VAR));
        envVar[0].toString().should.eql(color + '');
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
        sinon.stub(Job, 'createJob').callsFake(
            sinon.spy(() => Promise.resolve(job))
        );
        await exec({
          name,
          command,
          args: failArgs,
          workingDir,
          color,
          service,
          metric,
        });
        [processStdout, processStderr] = flush();
      });
      after(() => {
        Job.createJob.restore();
        restore();
      });

      it('should create a job', () => {
        Job.createJob.should.have.been.calledWith({
          name,
          workingDir,
          service,
          metric,
        });
      });

      it('should set the FORCE_COLOR variable', async () => {
        const envVar = await preadFile(path.join(WORKING_DIR, FORCE_COLOR_VAR));
        envVar[0].toString().should.eql(color + '');
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
