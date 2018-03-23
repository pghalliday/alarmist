import store from '../../../../../../src/cli/monitor/ui/redux/store';
import {
  reset,
  resize,
} from '../../../../../../src/cli/monitor/ui/redux/actions';

let width;
let height;

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('redux', () => {
        describe('resize', () => {
          before(() => {
            store.dispatch(reset());
            store.dispatch(resize({
              width: 100,
              height: 50,
            }));
            width = store.getState().layout.width;
            height = store.getState().layout.height;
          });

          it('should set the width', () => {
            width.should.eql(100);
          });

          it('should set the height', () => {
            height.should.eql(50);
          });
        });
      });
    });
  });
});
