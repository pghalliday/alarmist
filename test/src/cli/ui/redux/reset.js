import store from '../../../../../src/cli/ui/redux/store';
import {
  reset,
} from '../../../../../src/cli/ui/redux/actions';

let state;

describe('cli', () => {
  describe('ui', () => {
    describe('redux', () => {
      describe('reset', () => {
        before(() => {
          store.dispatch(reset());
          state = store.getState();
        });

        it('should restore the initial state', () => {
          state.should.eql({
            monitor: {},
            jobs: {},
            layout: {
              lines: [
                'monitor',
              ],
              selected: 0,
              expanded: false,
            },
          });
        });
      });
    });
  });
});
