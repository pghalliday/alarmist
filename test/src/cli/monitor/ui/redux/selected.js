import store from '../../../../../../src/cli/monitor/ui/redux/store';
import {
  reset,
  runStart,
  up,
  down,
  select,
  toggleExpanded,
} from '../../../../../../src/cli/monitor/ui/redux/actions';
import {
  MONITOR_LABEL,
} from '../../../../../../src/cli/monitor/ui/constants';
import {
  jobLabel,
} from '../../../../../../src/cli/monitor/ui/helpers';

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
  describe('monitor', () => {
    describe('ui', () => {
      describe('redux', () => {
        describe('with 3 lines and the first selected', () => {
          before(() => {
            store.dispatch(reset());
            store.dispatch(runStart(job));
            store.dispatch(runStart(otherJob));
          });

          describe('select', () => {
            it('should select the entry and expand', () => {
              store.dispatch(select(jobLabel(name)));
              store.getState().layout.selected.should.eql(1);
              store.getState().layout.expanded.should.be.true;
              store.dispatch(toggleExpanded());
              store.dispatch(select(jobLabel(otherName)));
              store.getState().layout.selected.should.eql(2);
              store.getState().layout.expanded.should.be.true;
              store.dispatch(toggleExpanded());
              store.dispatch(select(MONITOR_LABEL));
              store.getState().layout.selected.should.eql(0);
              store.getState().layout.expanded.should.be.true;
              store.dispatch(toggleExpanded());
            });
          });

          describe('down', () => {
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
