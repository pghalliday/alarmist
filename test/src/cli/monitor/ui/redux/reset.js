import {createStore} from '../../../../../../src/cli/monitor/ui/redux/store';
import {
  reset,
} from '../../../../../../src/cli/monitor/ui/redux/actions';

let state;
const emptyBuffer = Buffer.alloc(0);

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
              monitor: {
                log: emptyBuffer,
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
