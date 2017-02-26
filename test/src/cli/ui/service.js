import {
  createService,
} from '../../../../src/cli/ui/service';
import EventEmitter from 'events';
import {PassThrough} from 'stream';
import {createStore} from 'redux';

const monitor = new EventEmitter();
monitor.log = new PassThrough();
const reducer = sinon.spy();
const store = createStore(reducer);
const service = createService(monitor, store);

const log = Buffer.from('log');

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

      it('should dispatch monitorLog actions on write to log', () => {
        reducer.reset();
        monitor.log.write(log);
        reducer.should.have.been.calledWith(undefined, {
          type: 'MONITOR_LOG',
          payload: log,
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
