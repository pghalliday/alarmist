import {createStore} from 'redux';
// eslint-disable-next-line max-len
import {createReducer} from '../../../../../../src/cli/monitor/ui/redux/reducer';
import {
  reset,
  toggleExpanded,
} from '../../../../../../src/cli/monitor/ui/redux/actions';

let store;
let expanded;

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
        describe('toggleExpanded', () => {
          before(() => {
            store = createStore(createReducer({}, screen));
            store.dispatch(reset());
            store.dispatch(toggleExpanded());
            expanded = store.getState().layout.expanded;
          });

          it('should select the second line', () => {
            expanded.should.be.true;
          });

          describe('then toggleExpanded again', () => {
            before(() => {
              store.dispatch(toggleExpanded());
              expanded = store.getState().layout.expanded;
            });

            it('should select the third line', () => {
              expanded.should.be.false;
            });
          });
        });
      });
    });
  });
});
