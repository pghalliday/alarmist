import {createConnection} from 'net';
import {createMonitor} from '../../../src/alarmist/monitor';
import {
  WORKING_DIR,
  STDOUT_LOG,
  STDERR_LOG,
  ALL_LOG,
  CONTROL_SOCKET,
  LOG_SOCKET,
  READY_RESPONSE,
} from '../../../src/constants.js';
import path from 'path';
import _rimraf from 'rimraf';
import {readFile as _readFile} from 'fs';
import promisify from '../../../src/utils/promisify';
import _ from 'lodash';

const rimraf = promisify(_rimraf);
const readFile = promisify(_readFile);

const stdout = Buffer.from('stdout');
const stderr = Buffer.from('stderr');
const all = Buffer.concat([stdout, stderr]);
const exitCode = 0;

const stdoutLog = path.join(WORKING_DIR, STDOUT_LOG);
const stderrLog = path.join(WORKING_DIR, STDERR_LOG);
const allLog = path.join(WORKING_DIR, ALL_LOG);
const controlSocket = path.join(WORKING_DIR, CONTROL_SOCKET);
const logSocket = path.join(WORKING_DIR, LOG_SOCKET);

const name = 'job name';
const id = 1;
const startTime = 100000;
const endTime = 200000;

const startEvent = {
  name,
  id,
  startTime,
};

const endMessage = {
  endTime,
  exitCode,
};

const endEvent = {
  name,
  id,
  startTime,
  endTime,
  exitCode,
};

const beginMessage = {
  name,
  id,
};

const logData = 'log data';

const logEvent = {
  name,
  id,
  data: Buffer.from(logData),
};

describe('alarmist', () => {
  describe('createMonitor', () => {
    let monitor;
    beforeEach(async () => {
      await rimraf(WORKING_DIR);
      monitor = await createMonitor();
    });

    it('should open a stdout stream', async () => {
      monitor.stdout.should.be.ok;
      await monitor.close();
    });

    it('should open a stderr stream', async () => {
      monitor.stderr.should.be.ok;
      await monitor.close();
    });

    describe('should open a control socket', () => {
      let control;
      beforeEach(async () => {
        control = createConnection(controlSocket);
        await new Promise((resolve) => control.on('connect', resolve));
      });
      afterEach(async () => {
        control.end();
        await monitor.close();
      });

      describe('that when it receives a start message', () => {
        let event;
        let ready;
        beforeEach((done) => {
          control.write(JSON.stringify(startEvent));
          monitor.on('start', (_event) => {
            event = _event;
          });
          control.once('data', (_ready) => {
            ready = _ready;
            done();
          });
        });

        it('should emit a start event', () => {
          event.should.eql(startEvent);
        });

        it('should notify the job when ready', () => {
          ready.should.eql(Buffer.from(READY_RESPONSE));
        });

        describe('and then recieves an end message', () => {
          beforeEach((done) => {
            control.write(JSON.stringify(endMessage));
            monitor.on('end', (_event) => {
              event = _event;
              done();
            });
          });

          it('should emit an end event', () => {
            event.should.eql(endEvent);
          });
        });
      });
    });

    describe('should open a log socket', () => {
      let log;
      beforeEach(async () => {
        log = createConnection(logSocket);
        await new Promise((resolve) => log.on('connect', resolve));
      });
      afterEach(async () => {
        log.end();
        await monitor.close();
      });

      describe('that when it receives a begin message', () => {
        let ready;
        beforeEach((done) => {
          log.write(JSON.stringify(beginMessage));
          log.once('data', (_ready) => {
            ready = _ready;
            done();
          });
        });

        it('should notify the job when ready', () => {
          ready.should.eql(Buffer.from(READY_RESPONSE));
        });

        describe('and then recieves data', () => {
          let event;
          beforeEach((done) => {
            log.write(logData);
            monitor.on('log', (_event) => {
              event = _event;
              done();
            });
          });

          it('should emit a log event', () => {
            event.should.eql(logEvent);
          });
        });
      });
    });

    describe('#exit', () => {
      let exitEvent;
      let receivedStdout;
      let receivedStderr;
      beforeEach(async () => {
        await new Promise((resolve) => {
          monitor.on('exit', (event) => {
            exitEvent = event;
            monitor.cleanup = sinon.spy(() => Promise.resolve());
            resolve();
          });
          receivedStdout = Buffer.alloc(0);
          receivedStderr = Buffer.alloc(0);
          monitor.stdout.on('data', (data) => {
            receivedStdout = Buffer.concat([receivedStdout, data]);
          });
          monitor.stderr.on('data', (data) => {
            receivedStderr = Buffer.concat([receivedStderr, data]);
          });
          monitor.stdout.write(stdout);
          monitor.stderr.write(stderr);
          monitor.exit(exitCode);
        });
        await monitor.close();
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

      it('should allow stdout stream to be read', async () => {
        receivedStdout.should.eql(stdout);
      });

      it('should allow stderr stream to be read', async () => {
        receivedStderr.should.eql(stderr);
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
