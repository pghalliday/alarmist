import store from '../../../../../src/cli/ui/redux/store';
import {
  reset,
  monitorLog,
} from '../../../../../src/cli/ui/redux/actions';

let monitor;

const data1 = Buffer.from('data1');
const data2 = Buffer.from('data2');
const allData = Buffer.concat([data1, data2]);

describe('cli', () => {
  describe('ui', () => {
    describe('redux', () => {
      describe('monitorLog', () => {
        before(() => {
          store.dispatch(reset());
          store.dispatch(monitorLog(data1));
          monitor = store.getState().monitor;
        });

        it('should set the log data', () => {
          monitor.should.eql({
            log: data1,
          });
        });

        describe('when dispatched again', () => {
          before(() => {
            store.dispatch(monitorLog(data2));
            monitor = store.getState().monitor;
          });

          it('should append the new data', () => {
            monitor.should.eql({
              log: allData,
            });
          });
        });
      });
    });
  });
});
