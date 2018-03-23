import store from '../../../../../../src/cli/monitor/ui/redux/store';
import {
  reset,
  log,
} from '../../../../../../src/cli/monitor/ui/redux/actions';

let monitor;

const data1 = Buffer.from('data1');
const data2 = Buffer.from('data2');
const lines1 = ['data1'];
const allLines = ['data1data2'];
const allData = Buffer.concat([data1, data2]);

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('redux', () => {
        describe('log', () => {
          before(() => {
            store.dispatch(reset());
            store.dispatch(log(data1));
            monitor = store.getState().monitor;
          });

          it('should set the log data', () => {
            monitor.should.eql({
              log: data1,
              lines: lines1,
            });
          });

          describe('when dispatched again', () => {
            before(() => {
              store.dispatch(log(data2));
              monitor = store.getState().monitor;
            });

            it('should append the new data', () => {
              monitor.should.eql({
                log: allData,
                lines: allLines,
              });
            });
          });
        });
      });
    });
  });
});
