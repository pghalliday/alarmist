import _ from 'lodash';
import helper from '../../../../../../../helpers/blessed';
import blessed from 'blessed';
import Entry from '../../../../../../../../src/cli/monitor/ui/types/common/view/entry';
import {
  HEADER_HEIGHT,
} from '../../../../../../../../src/cli/monitor/ui/types/common/view/constants';

const top = 'top';
const left = 'left';
const width = 'width';
const height = 'height';

const text = 'text';
const bgcolor = 'bgcolor';
const fgcolor = 'fgcolor';
const headerState = {
  text,
  bgcolor,
  fgcolor,
};

let ret;
let entry;
const state = {
  selectors: {
    header: sinon.spy(() => headerState),
  },
};
const container = {
  append: sinon.spy(),
};

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('types', () => {
        describe('common', () => {
          describe('view', () => {
            describe('Entry', () => {
              before(() => {
                blessed.text.reset();
                entry = new Entry();
              });

              it('should construct the header', () => {
                blessed.text.should.have.been.calledWith({
                  height: HEADER_HEIGHT,
                  autoFocus: false,
                });
              });

              describe('when the header is clicked', () => {
                it('should emit a select event', (done) => {
                  entry.on('select', done);
                  helper.text.click();
                });
              });

              describe('setParent', () => {
                before(() => {
                  container.append.reset();
                  entry.setParent(container);
                });

                it('should append the header', () => {
                  container.append.should.have.been.calledWith(helper.text);
                });
              });

              describe('update', () => {
                before(() => {
                  helper.reset();
                  entry.update(state);
                });

                it('should set the text', () => {
                  helper.text.setContent.should.have.been.calledWith(' ' + text);
                });

                it('should set the bg color', () => {
                  helper.text.style.bg.should.eql(bgcolor);
                });

                it('should set the fg color', () => {
                  helper.text.style.fg.should.eql(fgcolor);
                });

                describe('with the same state', () => {
                  before(() => {
                    helper.reset();
                    entry.update(state);
                  });

                  it('should not set the text', () => {
                    helper.text.setContent.should.not.have.been.called;
                  });

                  it('should not set the bg color', () => {
                    expect(helper.text.style.bg).to.not.be.ok;
                  });

                  it('should not set the fg color', () => {
                    expect(helper.text.style.fg).to.not.be.ok;
                  });
                });
              });

              describe('layout', () => {
                before(() => {
                  helper.reset();
                  ret = entry.layout({
                    top,
                    left,
                    width,
                    height,
                  });
                });

                it('should return true', () => {
                  ret.should.eql(true);
                });

                it('should set the top', () => {
                  helper.text.top.should.eql(top);
                });

                it('should set the left', () => {
                  helper.text.left.should.eql(left);
                });

                it('should set the width', () => {
                  helper.text.width.should.eql(width);
                });

                describe('with the same rectangle', () => {
                  before(() => {
                    helper.reset();
                    ret = entry.layout({
                      top,
                      left,
                      width,
                      height,
                    });
                  });

                  it('should return false', () => {
                    ret.should.eql(false);
                  });

                  it('should not set the top', () => {
                    expect(helper.text.top).to.not.be.ok;
                  });

                  it('should not set the left', () => {
                    expect(helper.text.left).to.not.be.ok;
                  });

                  it('should not set the width', () => {
                    expect(helper.text.width).to.not.be.ok;
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
