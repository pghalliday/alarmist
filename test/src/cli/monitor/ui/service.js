import {
  createService,
} from '../../../../../src/cli/monitor/ui/service';
import EventEmitter from 'events';
import {PassThrough} from 'stream';
import {createStore} from 'redux';

const type = 'type';
const types = {
  [type]: {
    service: {
      start: sinon.spy(),
      end: sinon.spy(),
      log: sinon.spy(),
      reset: function() {
        this.start.reset();
        this.end.reset();
        this.log.reset();
      },
    },
  },
};
const monitor = new EventEmitter();
monitor.log = new PassThrough();
monitor.close = async () => Promise.resolve();
const reducer = sinon.spy();
const store = createStore(reducer);
const service = createService({monitor, store, types});
const status = {
  type,
};

const log = Buffer.from('log');

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('service', () => {
        after(async () => {
          await service.stop();
        });

        it('should dispatch end actions', () => {
          reducer.reset();
          types[type].service.reset();
          monitor.emit('end', 0);
          reducer.should.have.been.calledWith(undefined, {
            type: 'END',
            payload: 0,
          });
        });

        it('should dispatch run start actions', () => {
          reducer.reset();
          types[type].service.reset();
          monitor.emit('run-start', status);
          types[type].service.start.should.have.been.calledWith(status);
        });

        it('should dispatch run end actions', () => {
          reducer.reset();
          types[type].service.reset();
          monitor.emit('run-end', status);
          types[type].service.end.should.have.been.calledWith(status);
        });

        it('should dispatch log actions on write to log', () => {
          reducer.reset();
          types[type].service.reset();
          monitor.log.write(log);
          reducer.should.have.been.calledWith(undefined, {
            type: 'LOG',
            payload: log,
          });
        });

        it('should dispatch run log actions on log events', () => {
          reducer.reset();
          types[type].service.reset();
          monitor.emit('run-log', status);
          types[type].service.log.should.have.been.calledWith(status);
        });
      });
    });
  });
});
