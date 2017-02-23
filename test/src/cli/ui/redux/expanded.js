import store from '../../../../../src/cli/ui/redux/store';
import {
  reset,
  toggleExpanded,
} from '../../../../../src/cli/ui/redux/actions';

let expanded;

describe('cli', () => {
  describe('ui', () => {
    describe('redux', () => {
      describe('toggleExpanded', () => {
        before(() => {
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
