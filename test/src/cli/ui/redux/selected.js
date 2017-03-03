import store from '../../../../../src/cli/ui/redux/store';
import {
  reset,
  runStart,
  up,
  down,
} from '../../../../../src/cli/ui/redux/actions';

let selected;

const name = 'job name';
const id = 2;

const otherName = 'other job name';
const otherId = 1;

const job = {
  name,
  id,
};

const otherJob = {
  name: otherName,
  id: otherId,
};

describe('cli', () => {
  describe('ui', () => {
    describe('redux', () => {
      describe('with 3 lines and the first selected', () => {
        before(() => {
          store.dispatch(reset());
          store.dispatch(runStart(job));
          store.dispatch(runStart(otherJob));
        });

        describe('move down', () => {
          before(() => {
            store.dispatch(down());
            selected = store.getState().layout.selected;
          });

          it('should select the second line', () => {
            selected.should.eql(1);
          });

          describe('then down again', () => {
            before(() => {
              store.dispatch(down());
              selected = store.getState().layout.selected;
            });

            it('should select the third line', () => {
              selected.should.eql(2);
            });

            describe('then down again', () => {
              before(() => {
                store.dispatch(down());
                selected = store.getState().layout.selected;
              });

              it('should not change selected', () => {
                selected.should.eql(2);
              });
            });

            describe('then up', () => {
              before(() => {
                store.dispatch(up());
                selected = store.getState().layout.selected;
              });

              it('should reselect the second line', () => {
                selected.should.eql(1);
              });

              describe('then up again', () => {
                before(() => {
                  store.dispatch(up());
                  selected = store.getState().layout.selected;
                });

                it('should should reselect the first line', () => {
                  selected.should.eql(0);
                });

                describe('then up again', () => {
                  before(() => {
                    store.dispatch(up());
                    selected = store.getState().layout.selected;
                  });

                  it('should should not change selected', () => {
                    selected.should.eql(0);
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
