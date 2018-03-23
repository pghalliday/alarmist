import store from '../../../../../../src/cli/monitor/ui/redux/store';
import {
  reset,
  end,
} from '../../../../../../src/cli/monitor/ui/redux/actions';

let monitor;

const error = 'message';
const log = Buffer.alloc(0);
const lines = [''];

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('redux', () => {
        describe('end', () => {
          before(() => {
            store.dispatch(reset());
            store.dispatch(end(error));
            monitor = store.getState().monitor;
          });

          it('should set the error', () => {
            monitor.should.eql({
              error,
              log,
              lines,
            });
          });
        });
      });
    });
  });
});
