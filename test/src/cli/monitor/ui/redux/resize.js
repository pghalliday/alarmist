import {createStore} from 'redux';
// eslint-disable-next-line max-len
import {createReducer} from '../../../../../../src/cli/monitor/ui/redux/reducer';
import {
  reset,
  resize,
} from '../../../../../../src/cli/monitor/ui/redux/actions';

let newWidth;
let newHeight;

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
        describe('resize', () => {
          before(() => {
            const store = createStore(createReducer({}, screen));
            store.dispatch(reset());
            store.dispatch(resize({
              width: 100,
              height: 50,
            }));
            newWidth = store.getState().layout.width;
            newHeight = store.getState().layout.height;
          });

          it('should set the width', () => {
            newWidth.should.eql(100);
          });

          it('should set the height', () => {
            newHeight.should.eql(50);
          });
        });
      });
    });
  });
});
