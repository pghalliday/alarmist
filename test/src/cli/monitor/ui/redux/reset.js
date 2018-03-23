import store from '../../../../../../src/cli/monitor/ui/redux/store';
import {
  reset,
} from '../../../../../../src/cli/monitor/ui/redux/actions';

let state;
const emptyBuffer = Buffer.alloc(0);
const emptyLines = [''];

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('redux', () => {
        describe('reset', () => {
          before(() => {
            store.dispatch(reset());
            state = store.getState();
          });

          it('should restore the initial state', () => {
            state.should.eql({
              monitor: {
                log: emptyBuffer,
                lines: emptyLines,
              },
              jobs: {},
              layout: {
                lines: [
                  'monitor',
                ],
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
