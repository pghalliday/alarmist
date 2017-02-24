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
const all = Buffer.concat([stdout, stderr]);

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

      it('should dispatch update actions', () => {
        reducer.reset();
        monitor.emit('update', 'status');
        reducer.should.have.been.calledWith(undefined, {
          type: 'UPDATE',
          payload: 'status',
        });
      });

      describe('subscribeMonitorLog', () => {
        let unsubscribe;
        let logData;
        before(() => {
          logData = Buffer.alloc(0);
          unsubscribe = service.subscribeMonitorLog((data) => {
            logData = Buffer.concat([logData, data]);
          });
          monitor.stdout.write(stdout);
          monitor.stderr.write(stderr);
        });
        after(() => {
          unsubscribe();
        });

        it('should notify subscribers on writes', () => {
          logData.should.eql(all);
        });
      });

      describe('subscribeJobLog', () => {
        let unsubscribe;
        let logData;
        before(() => {
          unsubscribe = service.subscribeJobLog('name', 2, (data) => {
            logData = data;
          });
        });
        after(() => {
          unsubscribe();
        });

        it('should notify subscribers on log events', () => {
          logData = undefined;
          monitor.emit('log', {
            name: 'name',
            id: 2,
            data: 'log data',
          });
          logData.should.eql('log data');
        });

        it('should not notify subscribers for other ids', () => {
          logData = undefined;
          monitor.emit('log', {
            name: 'name',
            id: 1,
            data: 'log data',
          });
          expect(logData).to.be.undefined;
        });

        it('should not notify subscribers for other names', () => {
          logData = undefined;
          monitor.emit('log', {
            name: 'other name',
            id: 2,
            data: 'log data',
          });
          expect(logData).to.be.undefined;
        });
      });
    });
  });
});
