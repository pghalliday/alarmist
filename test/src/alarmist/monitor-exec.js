import * as Monitor from '../../../src/alarmist/monitor';
import {
  exec,
} from '../../../src/alarmist/monitor-exec.js';
import {Writable} from 'stream';
import chokidar from 'chokidar';
import path from 'path';
import {
  WORKING_DIR,
} from '../../../src/constants';
import promisify from '../../../src/utils/promisify';
import _rimraf from 'rimraf';
import _mkdirp from 'mkdirp';

const rimraf = promisify(_rimraf);
const mkdirp = promisify(_mkdirp);

const exitCode = 0;
const stdout = Buffer.from('stdout');
const stderr = Buffer.from('stderr');
// eslint-disable-next-line max-len
const exitingCommand = `node test/bin/command.js ${stdout.toString()} ${stderr.toString()} ${exitCode}`;
// eslint-disable-next-line max-len
const livingCommand = `node test/bin/service.js ${stdout.toString()} ${stderr.toString()}`;

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

function waitForFile(file) {
  return new Promise((resolve) => {
    chokidar.watch(WORKING_DIR).on('add', (newFile) => {
      if (newFile === file) {
        resolve();
      }
    });
  });
};

describe('alarmist', function() {
  describe('execMonitor', () => {
    describe('with a process that exits', () => {
      let monitor;
      let createMonitor;
      before(async () => {
        let execMonitor;
        const fnCreateMonitor = Monitor.createMonitor;
        await new Promise(async (resolve) => {
          monitor = {
            stdout: new TestWritable(),
            stderr: new TestWritable(),
            close: sinon.spy(() => Promise.resolve()),
            exit: sinon.spy(resolve),
          };
          createMonitor = sinon.spy(() => Promise.resolve(monitor));
          Monitor.createMonitor = createMonitor;
          execMonitor = await exec({
            command: exitingCommand,
          });
        });
        await execMonitor.close();
        Monitor.createMonitor = fnCreateMonitor;
      });

      it('should create a monitor', () => {
        createMonitor.should.have.been.calledOnce;
      });

      it('should pipe to the monitor stdout', () => {
        monitor.stdout.buffer.should.eql(stdout);
      });

      it('should pipe to the monitor stderr', () => {
        monitor.stderr.buffer.should.eql(stderr);
      });

      it('should call exit', () => {
        monitor.exit.should.have.been.calledWith(exitCode);
      });

      it('should close the monitor', () => {
        monitor.close.should.have.been.calledOnce;
      });
    });

    describe('with a process that lives', () => {
      let monitor;
      let createMonitor;
      before(async () => {
        await rimraf(WORKING_DIR);
        await mkdirp(WORKING_DIR);
        let execMonitor;
        const fnCreateMonitor = Monitor.createMonitor;
        monitor = {
          stdout: new TestWritable(),
          stderr: new TestWritable(),
          close: sinon.spy(async () => {
            await monitor.cleanup();
          }),
        };
        createMonitor = sinon.spy(() => Promise.resolve(monitor));
        Monitor.createMonitor = createMonitor;
        const waitPromise = waitForFile(path.join(WORKING_DIR, 'done'));
        execMonitor = await exec({
          command: livingCommand,
        });
        await waitPromise;
        await execMonitor.close();
        Monitor.createMonitor = fnCreateMonitor;
      });

      it('should create a monitor', () => {
        createMonitor.should.have.been.calledOnce;
      });

      it('should pipe to the monitor stdout', () => {
        monitor.stdout.buffer.should.eql(stdout);
      });

      it('should pipe to the monitor stderr', () => {
        monitor.stderr.buffer.should.eql(stderr);
      });

      it('should close the monitor', () => {
        monitor.close.should.have.been.calledOnce;
      });
    });
  });
});
