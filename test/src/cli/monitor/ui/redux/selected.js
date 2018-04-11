import {createStore} from 'redux';
// eslint-disable-next-line max-len
import {createReducer} from '../../../../../../src/cli/monitor/ui/redux/reducer';
import {
  reset,
  start,
  up,
  down,
  select,
  toggleExpanded,
} from '../../../../../../src/cli/monitor/ui/redux/actions';

let store;
let selected;

const id = 0;
const type = 'type';

const firstName = 'first name';
const secondName = 'second name';
const thirdName = 'third name';

const firstEntry = {
  name: firstName,
  id,
  type,
};

const secondEntry = {
  name: secondName,
  id,
  type,
};

const thirdEntry = {
  name: thirdName,
  id,
  type,
};

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
        describe('selected', () => {
          describe('with 3 lines and the first selected', () => {
            before(() => {
              store = createStore(createReducer({}, screen));
              store.dispatch(reset());
              store.dispatch(start(firstEntry));
              store.dispatch(start(secondEntry));
              store.dispatch(start(thirdEntry));
            });

            describe('select', () => {
              describe('with a different entry', () => {
                it('should select the entry and expand', () => {
                  store.dispatch(select(secondName));
                  store.getState().layout.selected.should.eql(1);
                  store.getState().layout.expanded.should.be.true;
                  store.dispatch(toggleExpanded());
                  store.dispatch(select(thirdName));
                  store.getState().layout.selected.should.eql(2);
                  store.getState().layout.expanded.should.be.true;
                  store.dispatch(toggleExpanded());
                  store.dispatch(select(firstName));
                  store.getState().layout.selected.should.eql(0);
                  store.getState().layout.expanded.should.be.true;
                  store.dispatch(toggleExpanded());
                });
              });

              describe('with the same entry', () => {
                it('should toggle expansion', () => {
                  store.dispatch(select(firstName));
                  const expanded = store.getState().layout.expanded;
                  store.dispatch(select(firstName));
                  store.getState().layout.expanded.should.eql(!expanded);
                  store.dispatch(select(firstName));
                  store.getState().layout.expanded.should.eql(expanded);
                });
              });
            });

            describe('down', () => {
              before(() => {
                store.dispatch(select(firstName));
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

                    it('should reselect the first line', () => {
                      selected.should.eql(0);
                    });

                    describe('then up again', () => {
                      before(() => {
                        store.dispatch(up());
                        selected = store.getState().layout.selected;
                      });

                      it('should not change selected', () => {
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
  });
});
