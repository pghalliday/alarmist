import _ from 'lodash';
import helper from '../../../../../../../helpers/blessed';
import blessed from 'blessed';
import copyPaste from 'copy-paste';
import Log from '../../../../../../../../src/cli/monitor/ui/types/base/view/log';
import Entry from '../../../../../../../../src/cli/monitor/ui/types/base/view/entry';
import {
  LOG_PROPERTIES,
  HEADER_HEIGHT,
  LOG_INDENT,
} from '../../../../../../../../src/cli/monitor/ui/types/base/view/constants';

let log;
let layoutReturn = true;
const logData = Buffer.from('log data');
const state = {
  selectors: {
    log: () => logData,
  },
};
const container = {
  append: sinon.spy(),
};
const top = 10;
const left = 5;
const width = 100;
const height = 20;
const rect = {
  top,
  left,
  width,
  height,
};

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('types', () => {
        describe('base', () => {
          describe('view', () => {
            describe('Log', () => {
              before(() => {
                blessed.text.reset();
                blessed.box.reset();
                log = new Log();
                sinon.spy(log, '_setLog');
                sinon.stub(Entry.prototype, 'setParent');
                sinon.stub(Entry.prototype, 'update');
                sinon.stub(Entry.prototype, 'layout', () => layoutReturn);
                sinon.stub(Entry.prototype, 'collapse');
                sinon.stub(Entry.prototype, 'expand');
                sinon.stub(Entry.prototype, 'focus');
              });

              after(() => {
                Entry.prototype.setParent.reset();
                Entry.prototype.update.reset();
                Entry.prototype.layout.reset();
                Entry.prototype.collapse.reset();
                Entry.prototype.expand.reset();
                Entry.prototype.focus.reset();
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
                  copyPaste.copy.reset();
                  helper.box.shiftClick();
                });

                // eslint-disable-next-line max-len
                it('should copy text without control sequences to clipboard', () => {
                  copyPaste.copy.should.have.been.calledWith(helper.TEST_TEXT);
                });
              });

              describe('when the log is shift right clicked', () => {
                before(() => {
                  copyPaste.copy.reset();
                  helper.box.shiftRightClick();
                });

                // eslint-disable-next-line max-len
                it('should copy text without control sequences to clipboard', () => {
                  copyPaste.copy.should.have.been.calledWith(helper.TEST_CONTENT);
                });
              });

              describe('on a "y" keypress', () => {
                before(() => {
                  copyPaste.copy.reset();
                  helper.box.pressKey('y');
                });

                // eslint-disable-next-line max-len
                it('should copy text without control sequences to clipboard', () => {
                  copyPaste.copy.should.have.been.calledWith(helper.TEST_TEXT);
                });
              });

              describe('on a "SHIFT-y" keypress', () => {
                before(() => {
                  copyPaste.copy.reset();
                  // eslint-disable-next-line new-cap
                  helper.box.pressKey('S-y');
                });

                // eslint-disable-next-line max-len
                it('should copy text without control sequences to clipboard', () => {
                  copyPaste.copy.should.have.been.calledWith(helper.TEST_CONTENT);
                });
              });

              describe('setParent', () => {
                before(() => {
                  Entry.prototype.setParent.reset();
                  container.append.reset();
                  log.setParent(container);
                });

                it('should set the parent for super class', () => {
                  Entry.prototype.setParent.should.have.been.calledWith(container);
                });

                it('should append the log', () => {
                  container.append.should.have.been.calledWith(helper.box);
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

              describe('update', () => {
                before(() => {
                  Entry.prototype.update.reset();
                  log._setLog.reset();
                  log.update(state);
                });

                it('should update for super class', () => {
                  Entry.prototype.update.should.have.been.calledWith(state);
                });

                it('should set the log box content', () => {
                  log._setLog.should.have.been.calledWith(logData);
                });

                describe('when called with the same state', () => {
                  before(() => {
                    log._setLog.reset();
                    log.update(state);
                  });

                  it('should not set the log box content', () => {
                    log._setLog.should.not.have.been.called;
                  });
                });
              });

              describe('layout', () => {
                before(() => {
                  Entry.prototype.layout.reset();
                  layoutReturn = true;
                  helper.reset();
                  log.layout(rect);
                });

                it('should layout for super class', () => {
                  Entry.prototype.layout.should.have.been.calledWith(rect);
                });

                it('should set the log top', () => {
                  helper.box.top.should.eql(top + HEADER_HEIGHT);
                });

                it('should set the log left', () => {
                  helper.box.left.should.eql(left + LOG_INDENT);
                });

                it('should set the log width', () => {
                  helper.box.width.should.eql(width - LOG_INDENT);
                });

                it('should set the log height', () => {
                  helper.box.height.should.eql(height - HEADER_HEIGHT);
                });

                describe('when the super signals no change', () => {
                  before(() => {
                    Entry.prototype.layout.reset();
                    layoutReturn = false;
                    helper.reset();
                    log.layout(rect);
                  });

                  it('should not set the log top', () => {
                    expect(helper.box.top).to.not.be.ok;
                  });

                  it('should not set the log left', () => {
                    expect(helper.box.left).to.not.be.ok;
                  });

                  it('should not set the log width', () => {
                    expect(helper.box.width).to.not.be.ok;
                  });

                  it('should not set the log height', () => {
                    expect(helper.box.height).to.not.be.ok;
                  });
                });
              });

              describe('expand', () => {
                before(() => {
                  Entry.prototype.expand.reset();
                  helper.reset();
                  helper.lines = [];
                  log.expand();
                });

                it('should expand for super class', () => {
                  Entry.prototype.expand.should.have.been.called;
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
                    Entry.prototype.collapse.reset();
                    helper.reset();
                    log.collapse();
                  });

                  it('should collapse for super class', () => {
                    Entry.prototype.collapse.should.have.been.called;
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
                  Entry.prototype.focus.reset();
                  helper.reset();
                  log.focus();
                });

                it('should focus for super class', () => {
                  Entry.prototype.focus.should.have.been.called;
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
  });
});
