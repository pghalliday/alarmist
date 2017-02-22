import store from '../../../../../src/cli/ui/redux/store';
import {
  reset,
  exit,
} from '../../../../../src/cli/ui/redux/actions';

let monitor;

const exitCode = 0;

describe('cli', () => {
  describe('ui', () => {
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
});
