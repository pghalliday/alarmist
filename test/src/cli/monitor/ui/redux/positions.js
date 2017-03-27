import store from '../../../../../../src/cli/monitor/ui/redux/store';
import {
  reset,
  runStart,
  moveUp,
  moveDown,
} from '../../../../../../src/cli/monitor/ui/redux/actions';
import {
  MONITOR_LABEL,
} from '../../../../../../src/cli/monitor/ui/constants';
import {
  jobLabel,
} from '../../../../../../src/cli/monitor/ui/helpers';

let selected;
let lines;

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
                jobLabel(name),
                MONITOR_LABEL,
                jobLabel(otherName),
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
                  jobLabel(name),
                  jobLabel(otherName),
                  MONITOR_LABEL,
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
                    jobLabel(name),
                    jobLabel(otherName),
                    MONITOR_LABEL,
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
                    jobLabel(name),
                    MONITOR_LABEL,
                    jobLabel(otherName),
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
                      MONITOR_LABEL,
                      jobLabel(name),
                      jobLabel(otherName),
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
                        MONITOR_LABEL,
                        jobLabel(name),
                        jobLabel(otherName),
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
