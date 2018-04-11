import {createStore} from 'redux';
// eslint-disable-next-line max-len
import {createReducer} from '../../../../../../src/cli/monitor/ui/redux/reducer';
import {
  reset,
} from '../../../../../../src/cli/monitor/ui/redux/actions';

let state;

const width = 200;
const height = 100;
const screen = {
  width,
  height,
};

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('redux', () => {
        describe('reset', () => {
          before(() => {
            const store = createStore(createReducer({}, screen));
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
                width,
                height,
              },
            });
          });
        });
      });
    });
  });
});
