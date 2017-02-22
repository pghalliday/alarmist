import store from '../../../../src/cli/redux/store';
import {
  reset,
  exit,
} from '../../../../src/cli/redux/actions';

let monitor;

const exitCode = 0;

describe('cli', () => {
  describe('redux', () => {
    describe('exit', () => {
      before(() => {
        store.dispatch(reset());
        store.dispatch(exit(exitCode));
        monitor = store.getState().monitor;
      });

      it('should set the exit code', () => {
        monitor.should.eql({
          exitCode,
        });
      });
    });
  });
});
