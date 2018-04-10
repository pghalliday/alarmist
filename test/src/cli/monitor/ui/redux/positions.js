import {createStore} from '../../../../../../src/cli/monitor/ui/redux/store';
import {
  reset,
  start,
  moveUp,
  moveDown,
} from '../../../../../../src/cli/monitor/ui/redux/actions';

let store;
let selected;
let lines;

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

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('redux', () => {
        describe('positions', () => {
          describe('with 3 lines and the first selected', () => {
            before(() => {
              store = createStore({});
              store.dispatch(reset());
              store.dispatch(start(firstEntry));
              store.dispatch(start(secondEntry));
              store.dispatch(start(thirdEntry));
            });

            describe('move down', () => {
              before(() => {
                store.dispatch(moveDown());
                const layout = store.getState().layout;
                selected = layout.selected;
                lines = layout.lines;
              });

              it('should swap the first and second lines', () => {
                selected.should.eql(1);
                lines.should.eql([
                  secondName,
                  firstName,
                  thirdName,
                ]);
              });

              describe('then down again', () => {
                before(() => {
                  store.dispatch(moveDown());
                  const layout = store.getState().layout;
                  selected = layout.selected;
                  lines = layout.lines;
                });

                it('should swap the second and third lines', () => {
                  selected.should.eql(2);
                  lines.should.eql([
                    secondName,
                    thirdName,
                    firstName,
                  ]);
                });

                describe('then down again', () => {
                  before(() => {
                    store.dispatch(moveDown());
                    const layout = store.getState().layout;
                    selected = layout.selected;
                    lines = layout.lines;
                  });

                  it('should not change anything', () => {
                    selected.should.eql(2);
                    lines.should.eql([
                      secondName,
                      thirdName,
                      firstName,
                    ]);
                  });
                });

                describe('then up', () => {
                  before(() => {
                    store.dispatch(moveUp());
                    const layout = store.getState().layout;
                    selected = layout.selected;
                    lines = layout.lines;
                  });

                  it('should swap the second and third lines back', () => {
                    selected.should.eql(1);
                    lines.should.eql([
                      secondName,
                      firstName,
                      thirdName,
                    ]);
                  });

                  describe('then up again', () => {
                    before(() => {
                      store.dispatch(moveUp());
                      const layout = store.getState().layout;
                      selected = layout.selected;
                      lines = layout.lines;
                    });

                    it('should swap the first and second lines back', () => {
                      selected.should.eql(0);
                      lines.should.eql([
                        firstName,
                        secondName,
                        thirdName,
                      ]);
                    });

                    describe('then up again', () => {
                      before(() => {
                        store.dispatch(moveUp());
                        const layout = store.getState().layout;
                        selected = layout.selected;
                        lines = layout.lines;
                      });

                      it('should not change anything', () => {
                        selected.should.eql(0);
                        lines.should.eql([
                          firstName,
                          secondName,
                          thirdName,
                        ]);
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
