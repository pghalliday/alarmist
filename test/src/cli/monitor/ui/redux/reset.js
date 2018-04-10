import {createStore} from '../../../../../../src/cli/monitor/ui/redux/store';
import {
  reset,
} from '../../../../../../src/cli/monitor/ui/redux/actions';

let state;

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('redux', () => {
        describe('reset', () => {
          before(() => {
            const store = createStore({});
            store.dispatch(reset());
            state = store.getState();
          });

          it('should restore the initial state', () => {
            state.should.eql({
              entries: {},
              layout: {
                lines: [],
                selected: 0,
                expanded: false,
                width: 0,
                height: 0,
              },
            });
          });
        });
      });
    });
  });
});
