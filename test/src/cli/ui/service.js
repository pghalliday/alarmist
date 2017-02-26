import {
  createService,
} from '../../../../src/cli/ui/service';
import EventEmitter from 'events';
import {PassThrough} from 'stream';
import {createStore} from 'redux';

const monitor = new EventEmitter();
monitor.stdout = new PassThrough();
monitor.stderr = new PassThrough();
const reducer = sinon.spy();
const store = createStore(reducer);
const service = createService(monitor, store);

const stdout = Buffer.from('stdout');
const stderr = Buffer.from('stderr');

describe('cli', () => {
  describe('ui', () => {
    describe('service', () => {
      after(() => {
        service.stop();
      });

      it('should dispatch exit actions', () => {
        reducer.reset();
        monitor.emit('exit', 0);
        reducer.should.have.been.calledWith(undefined, {
          type: 'EXIT',
          payload: 0,
        });
      });

      it('should dispatch start actions', () => {
        reducer.reset();
        monitor.emit('start', 'status');
        reducer.should.have.been.calledWith(undefined, {
          type: 'START',
          payload: 'status',
        });
      });

      it('should dispatch end actions', () => {
        reducer.reset();
        monitor.emit('end', 'status');
        reducer.should.have.been.calledWith(undefined, {
          type: 'END',
          payload: 'status',
        });
      });

      it('should dispatch monitorLog actions on write to stdout', () => {
        reducer.reset();
        monitor.stdout.write(stdout);
        reducer.should.have.been.calledWith(undefined, {
          type: 'MONITOR_LOG',
          payload: stdout,
        });
      });

      it('should dispatch monitorLog actions on write to stderr', () => {
        reducer.reset();
        monitor.stderr.write(stderr);
        reducer.should.have.been.calledWith(undefined, {
          type: 'MONITOR_LOG',
          payload: stderr,
        });
      });

      it('should dispatch jobLog actions on log events', () => {
        reducer.reset();
        monitor.emit('log', {
          name: 'name',
          id: 2,
          data: 'log data',
        });
        reducer.should.have.been.calledWith(undefined, {
          type: 'JOB_LOG',
          payload: {
            name: 'name',
            id: 2,
            data: 'log data',
          },
        });
      });
    });
  });
});
