import {
  createService,
} from '../../../../../src/cli/monitor/ui/service';
import EventEmitter from 'events';
import {PassThrough} from 'stream';
import {createStore} from 'redux';

const monitor = new EventEmitter();
monitor.log = new PassThrough();
monitor.close = async () => Promise.resolve();
const reducer = sinon.spy();
const store = createStore(reducer);
const service = createService(monitor, store);

const log = Buffer.from('log');

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('service', () => {
        after(async () => {
          await service.stop();
        });

        it('should dispatch end actions', () => {
          reducer.resetHistory();
          monitor.emit('end', 0);
          reducer.should.have.been.calledWith(undefined, {
            type: 'END',
            payload: 0,
          });
        });

        it('should dispatch run start actions', () => {
          reducer.resetHistory();
          monitor.emit('run-start', 'status');
          reducer.should.have.been.calledWith(undefined, {
            type: 'RUN_START',
            payload: 'status',
          });
        });

        it('should dispatch run end actions', () => {
          reducer.resetHistory();
          monitor.emit('run-end', 'status');
          reducer.should.have.been.calledWith(undefined, {
            type: 'RUN_END',
            payload: 'status',
          });
        });

        it('should dispatch log actions on write to log', () => {
          reducer.resetHistory();
          monitor.log.write(log);
          reducer.should.have.been.calledWith(undefined, {
            type: 'LOG',
            payload: log,
          });
        });

        it('should dispatch run log actions on log events', () => {
          reducer.resetHistory();
          monitor.emit('run-log', {
            name: 'name',
            id: 2,
            data: 'log data',
          });
          reducer.should.have.been.calledWith(undefined, {
            type: 'RUN_LOG',
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
});
