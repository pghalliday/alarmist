import _ from 'lodash';
import helper from '../../../../../helpers/blessed';
import blessed from 'blessed';
import clipboardy from 'clipboardy';
import Log from '../../../../../../src/cli/monitor/ui/view/log';
import Entry from '../../../../../../src/cli/monitor/ui/view/entry';
import {
  LOG_PROPERTIES,
} from '../../../../../../src/cli/monitor/ui/view/constants';

let log;
const state = {};
const container = {
  append: sinon.spy(),
};

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('view', () => {
        describe('Log', () => {
          before(() => {
            blessed.text.resetHistory();
            blessed.box.resetHistory();
            log = new Log();
            sinon.spy(log, '_setLog');
            sinon.spy(log, '_update');
          });

          it('should be an Entry', () => {
            log.should.be.an.instanceOf(Entry);
          });

          it('should construct the log', () => {
            blessed.box.should.have.been.calledWith(LOG_PROPERTIES);
          });

          it('should hide the log', () => {
            helper.box.hide.should.have.been.calledOnce;
          });

          it('should clear the log', () => {
            helper.box.setContent.should.have.been.calledWith('');
          });

          describe('when the log is shift clicked', () => {
            before(() => {
              clipboardy.writeSync.resetHistory();
              helper.box.shiftClick();
            });

            // eslint-disable-next-line max-len
            it('should copy text without control sequences to clipboard', () => {
              clipboardy.writeSync.should.have.been.calledWith(
                  helper.TEST_TEXT
              );
            });
          });

          describe('when the log is shift right clicked', () => {
            before(() => {
              clipboardy.writeSync.resetHistory();
              helper.box.shiftRightClick();
            });

            // eslint-disable-next-line max-len
            it('should copy text without control sequences to clipboard', () => {
              clipboardy.writeSync.should.have.been.calledWith(
                  helper.TEST_CONTENT
              );
            });
          });

          describe('on a "y" keypress', () => {
            before(() => {
              clipboardy.writeSync.resetHistory();
              helper.box.pressKey('y');
            });

            // eslint-disable-next-line max-len
            it('should copy text without control sequences to clipboard', () => {
              clipboardy.writeSync.should.have.been.calledWith(
                  helper.TEST_TEXT
              );
            });
          });

          describe('on a "SHIFT-y" keypress', () => {
            before(() => {
              clipboardy.writeSync.resetHistory();
              // eslint-disable-next-line new-cap
              helper.box.pressKey('S-y');
            });

            // eslint-disable-next-line max-len
            it('should copy text without control sequences to clipboard', () => {
              clipboardy.writeSync.should.have.been.calledWith(
                  helper.TEST_CONTENT
              );
            });
          });

          describe('_setContentParent', () => {
            before(() => {
              container.append.resetHistory();
              log._setContentParent(container);
            });

            it('should append the log', () => {
              container.append.should.have.been.calledWith(helper.box);
            });
          });

          describe('_update', () => {
            before(() => {
              log._update.resetHistory();
              log._update(state);
            });

            it('should update the state', () => {
              log._update.should.have.been.calledOnce;
            });
          });

          describe('clear', () => {
            before(() => {
              helper.reset();
              log.clear();
            });

            it('should clear the log box', () => {
              helper.box.setContent.should.have.been.calledWith('');
            });
          });

          describe('_setLog', () => {
            before(() => {
              helper.reset();
              log._setLog(Buffer.from('log data'));
            });

            it('should set the log box content', () => {
              helper.box.setContent.should.have.been.calledWith('log data');
            });
          });

          describe('setLog', () => {
            const buffer = Buffer.from('log data');
            before(() => {
              log.setLog(buffer);
            });

            it('should set the log box content', () => {
              log._setLog.should.have.been.calledWith(buffer);
            });

            describe('when called with the same buffer', () => {
              before(() => {
                log._setLog.resetHistory();
                log.setLog(buffer);
              });

              it('should not set the log box content', () => {
                log._setLog.should.not.have.been.called;
              });
            });
          });

          describe('setContentHeight', () => {
            before(() => {
              helper.reset();
              log.setContentHeight(10);
            });

            it('should set the log height', () => {
              helper.box.height.should.eql(10);
            });
          });

          describe('_setContentTop', () => {
            before(() => {
              helper.reset();
              log._setContentTop(10);
            });

            it('should set the log top', () => {
              helper.box.top.should.eql(10);
            });
          });

          describe('expand', () => {
            before(() => {
              helper.reset();
              helper.lines = [];
              log.expand();
            });

            it('should show the log', () => {
              helper.box.show.should.have.been.calledOnce;
            });

            describe('then expand again', () => {
              before(() => {
                helper.reset();
                log.expand();
              });

              it('should do nothing', () => {
                helper.box.show.should.not.have.been.called;
              });
            });

            describe('then collapse', () => {
              before(() => {
                helper.reset();
                log.collapse();
              });

              it('should hide the log', () => {
                helper.box.hide.should.have.been.calledOnce;
              });

              describe('then collapse again', () => {
                before(() => {
                  helper.reset();
                  log.collapse();
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
              log.focus();
            });

            it('should focus the log', () => {
              helper.box.focus.should.have.been.calledOnce;
            });
          });
        });
      });
    });
  });
});
