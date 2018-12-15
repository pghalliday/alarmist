import _ from 'lodash';
import helper from '../../../../../helpers/blessed';
import blessed from 'blessed';
import asciichart from 'asciichart';
import Metric from '../../../../../../src/cli/monitor/ui/view/metric';
import Entry from '../../../../../../src/cli/monitor/ui/view/entry';
import {
  CHART_PROPERTIES,
  CHART_PADDING,
} from '../../../../../../src/cli/monitor/ui/view/constants';

let metric;
const noLinesState = {
  lines: [''],
};
const noRangeState = {
  lines: ['100', '100', '100', ''],
};
const goodRangeState = {
  lines: ['100', '80', '120', ''],
};
const goodState = {
  lines: ['100', '80', '120, 0', ''],
  name: 'jobName',
};
const warningState = {
  lines: ['100', '80', '120, 1, this is a warning', ''],
  name: 'jobName',
};
const errorState = {
  lines: ['100', '80', '120, 2, this, is an error', ''],
  name: 'jobName',
};
const unknownState = {
  lines: ['100', '80', '120, 3', ''],
  name: 'jobName',
};
const endState = {
  name: 'jobName',
  endTime: 12345,
  error: 'end error',
  lines: [''],
};
const endWithoutErrorState = {
  name: 'jobName',
  endTime: 12345,
  lines: [''],
};
const container = {
  append: sinon.spy(),
};

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('view', () => {
        describe('Metric', () => {
          before(() => {
            blessed.text.resetHistory();
            blessed.box.resetHistory();
            metric = new Metric();
            sinon.spy(metric, 'setHeader');
          });

          it('should be an Entry', () => {
            metric.should.be.an.instanceOf(Entry);
          });

          it('should construct the chart', () => {
            blessed.box.should.have.been.calledWith(CHART_PROPERTIES);
          });

          it('should hide the chart', () => {
            helper.box.hide.should.have.been.calledOnce;
          });

          it('should clear the chart', () => {
            helper.box.setContent.should.have.been.calledWith('');
          });

          describe('_setContentParent', () => {
            before(() => {
              container.append.resetHistory();
              metric._setContentParent(container);
            });

            it('should append the chart', () => {
              container.append.should.have.been.calledWith(helper.box);
            });
          });

          describe('_update', () => {
            describe('with no lines', () => {
              before(() => {
                helper.reset();
                helper.box.width = 100;
                metric._update(noLinesState);
              });

              it('should clear the chart', () => {
                helper.box.setContent.should.have.been.calledWith('');
              });
            });

            describe('with no range of values', () => {
              before(() => {
                helper.reset();
                helper.box.width = 100;
                metric._update(noRangeState);
              });

              it('should clear the chart', () => {
                helper.box.setContent.should.have.been.calledWith('');
              });
            });

            describe('with a good range of values', () => {
              before(() => {
                helper.reset();
                helper.box.width = 100;
                helper.box.height = 10;
                metric._update(goodRangeState);
              });

              it('should update the chart', () => {
                helper.box.setContent.should.have.been.calledWith(
                    asciichart.plot([100, 80, 120], {
                      padding: CHART_PADDING,
                      height: 10 - 1,
                    })
                );
              });
            });

            describe('with a good status', () => {
              before(() => {
                helper.reset();
                helper.box.width = 100;
                helper.box.height = 10;
                metric.setHeader.resetHistory();
                metric._update(goodState);
              });

              it('should report the state', () => {
                metric.setHeader.should.have.been.calledWith(
                    ' jobName: 120', 'green'
                );
              });
            });

            describe('with a warning status', () => {
              before(() => {
                helper.reset();
                helper.box.width = 100;
                helper.box.height = 10;
                metric.setHeader.resetHistory();
                metric._update(warningState);
              });

              it('should report the state', () => {
                metric.setHeader.should.have.been.calledWith(
                    ' jobName: 120 -  this is a warning', 'yellow'
                );
              });
            });

            describe('with an error status', () => {
              before(() => {
                helper.reset();
                helper.box.width = 100;
                helper.box.height = 10;
                metric.setHeader.resetHistory();
                metric._update(errorState);
              });

              it('should report the state', () => {
                metric.setHeader.should.have.been.calledWith(
                    ' jobName: 120 -  this, is an error', 'red'
                );
              });
            });

            describe('with an unknown status', () => {
              before(() => {
                helper.reset();
                helper.box.width = 100;
                helper.box.height = 10;
                metric.setHeader.resetHistory();
                metric._update(unknownState);
              });

              it('should report the state', () => {
                metric.setHeader.should.have.been.calledWith(
                    ' jobName: 120', 'red'
                );
              });
            });

            describe('with an end time', () => {
              before(() => {
                helper.reset();
                helper.box.width = 100;
                helper.box.height = 10;
                metric.setHeader.resetHistory();
                metric._update(endState);
              });

              it('should report the end', () => {
                metric.setHeader.should.have.been.calledWith(
                    ' jobName: end error', 'red'
                );
              });
            });

            describe('with an end time and no error', () => {
              before(() => {
                helper.reset();
                helper.box.width = 100;
                helper.box.height = 10;
                metric.setHeader.resetHistory();
                metric._update(endWithoutErrorState);
              });

              it('should report the end', () => {
                metric.setHeader.should.have.been.calledWith(
                    ' jobName: ended', 'red'
                );
              });
            });
          });

          describe('clear', () => {
            before(() => {
              helper.reset();
              metric.clear();
            });

            it('should clear the chart box', () => {
              helper.box.setContent.should.have.been.calledWith('');
            });
          });

          describe('setContentHeight', () => {
            before(() => {
              helper.reset();
              metric.setContentHeight(10);
            });

            it('should set the chart height', () => {
              helper.box.height.should.eql(10);
            });
          });

          describe('_setContentTop', () => {
            before(() => {
              helper.reset();
              metric._setContentTop(10);
            });

            it('should set the chart top', () => {
              helper.box.top.should.eql(10);
            });
          });

          describe('expand', () => {
            before(() => {
              helper.reset();
              helper.lines = [];
              metric.expand();
            });

            it('should show the chart', () => {
              helper.box.show.should.have.been.calledOnce;
            });

            describe('then expand again', () => {
              before(() => {
                helper.reset();
                metric.expand();
              });

              it('should do nothing', () => {
                helper.box.show.should.not.have.been.called;
              });
            });

            describe('then collapse', () => {
              before(() => {
                helper.reset();
                metric.collapse();
              });

              it('should hide the chart', () => {
                helper.box.hide.should.have.been.calledOnce;
              });

              describe('then collapse again', () => {
                before(() => {
                  helper.reset();
                  metric.collapse();
                });

                it('should do nothing', () => {
                  helper.box.hide.should.not.have.been.called;
                });
              });
            });
          });

          describe('focus', () => {
            before(() => {
              helper.reset();
              metric.focus();
            });

            it('should focus the chart', () => {
              helper.box.focus.should.have.been.calledOnce;
            });
          });
        });
      });
    });
  });
});
