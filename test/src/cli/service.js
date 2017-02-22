import {
  createService,
} from '../../../src/cli/service';
import EventEmitter from 'events';
import {createStore} from 'redux';

const monitor = new EventEmitter();
const reducer = sinon.spy();
const store = createStore(reducer);
const service = createService(monitor, store);

describe('cli', () => {
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

    it('should dispatch update actions', () => {
      reducer.reset();
      monitor.emit('update', 'status');
      reducer.should.have.been.calledWith(undefined, {
        type: 'UPDATE',
        payload: 'status',
      });
    });
  });
});
