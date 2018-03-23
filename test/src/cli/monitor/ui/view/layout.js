import logger from '../../../../../../src/cli/monitor/ui/view/logger';
import blessed from 'blessed';
import helper from '../../../../../helpers/blessed';
import Layout from '../../../../../../src/cli/monitor/ui/view/layout';
import {
  SELECTED_INDICATOR_PROPERTIES,
  RIGHT_POINTER,
  DOWN_POINTER,
} from '../../../../../../src/cli/monitor/ui/view/constants';
import EventEmitter from 'events';

class Entry extends EventEmitter {
  constructor() {
    super();
    this.setParent = sinon.spy();
    this.collapse = sinon.spy();
    this.expand = sinon.spy();
    this.setTop = sinon.spy();
    this.focus = sinon.spy();
    this.setContentHeight = sinon.spy();
  }
  getHeaderHeight() {
    return 1;
  }
  select() {
    this.emit('select');
  }
  reset() {
    this.setParent.reset();
    this.collapse.reset();
    this.expand.reset();
    this.setTop.reset();
    this.focus.reset();
    this.setContentHeight.reset();
  }
}

let layout;
const container = {
  append: sinon.spy(),
  height: 10,
  focus: sinon.spy(),
};
const label1 = 'label1';
const label2 = 'label2';
const label3 = 'label3';
const entry1 = new Entry();
const entry2 = new Entry();
const entry3 = new Entry();
const notExpandedState = {
  lines: [
    label2,
    label3,
    label1,
  ],
  selected: 1,
  expanded: false,
};
const expandedState = {
  lines: [
    label2,
    label3,
    label1,
  ],
  selected: 1,
  expanded: true,
};
let selectedIndicator;

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('view', () => {
        describe('Layout', () => {
          before(() => {
            container.append.reset();
            blessed.text.reset();
            layout = new Layout(container);
            selectedIndicator = helper.text;
          });

          it('should create the selected indicator', () => {
            blessed.text.should.have.been.calledWith(
              SELECTED_INDICATOR_PROPERTIES
            );
          });

          it('should append the selected indicator', () => {
            container.append.should.have.been.calledWith(
              sinon.match.same(selectedIndicator)
            );
          });

          describe('when the selected indicator is clicked', () => {
            it('should emit a toggleExpanded event', (done) => {
              layout.on('toggleExpanded', done);
              selectedIndicator.click();
            });
          });

          describe('append', () => {
            before(() => {
              entry1.reset();
              entry2.reset();
              entry3.reset();
              layout.append(label1, entry1);
              layout.append(label2, entry2);
              layout.append(label3, entry3);
            });

            it('should set the entry parents', () => {
              entry1.setParent.should.have.been.calledWith(container);
              entry2.setParent.should.have.been.calledWith(container);
              entry3.setParent.should.have.been.calledWith(container);
            });

            describe('when an entry is selected', () => {
              it('should emit a select event', (done) => {
                layout.on('select', (label) => {
                  label.should.eql(label2);
                  done();
                });
                entry2.select();
              });
            });

            describe('then apply', () => {
              describe('when not expanded', () => {
                before(() => {
                  entry1.reset();
                  entry2.reset();
                  entry3.reset();
                  container.focus.reset();
                  layout.apply(notExpandedState);
                });

                // eslint-disable-next-line max-len
                it('should set the selected indicator to a right pointer', () => {
                  selectedIndicator.content.should.eql(RIGHT_POINTER);
                });

                it('should focus the container', () => {
                  container.focus.should.have.been.calledOnce;
                });

                it('should preset the content heights', () => {
                  entry1.setContentHeight.should.have.been.calledWith(7);
                  entry2.setContentHeight.should.have.been.calledWith(7);
                  entry3.setContentHeight.should.have.been.calledWith(7);
                });

                it('should hide the contents', () => {
                  entry1.collapse.should.have.been.calledOnce;
                  entry2.collapse.should.have.been.calledOnce;
                  entry3.collapse.should.have.been.calledOnce;
                });

                it('should calculate the top positions', () => {
                  entry2.setTop.should.have.been.calledWith(0);
                  entry3.setTop.should.have.been.calledWith(1);
                  entry1.setTop.should.have.been.calledWith(2);
                  selectedIndicator.top.should.eql(1);
                });

                describe('then apply with the same state', () => {
                  before(() => {
                    logger.log.reset();
                    layout.apply(notExpandedState);
                  });

                  it('should do nothing', () => {
                    logger.log.should.not.have.been.called;
                  });
                });
              });

              describe('when expanded', () => {
                before(() => {
                  entry1.reset();
                  entry2.reset();
                  entry3.reset();
                  layout.apply(expandedState);
                });

                // eslint-disable-next-line max-len
                it('should set the selected indicator to a down pointer', () => {
                  selectedIndicator.content.should.eql(DOWN_POINTER);
                });

                it('should preset the content heights', () => {
                  entry1.setContentHeight.should.have.been.calledWith(7);
                  entry2.setContentHeight.should.have.been.calledWith(7);
                  entry3.setContentHeight.should.have.been.calledWith(7);
                });

                it('should hide the contents', () => {
                  entry1.collapse.should.have.been.calledOnce;
                  entry2.collapse.should.have.been.calledOnce;
                  entry3.collapse.should.have.been.calledOnce;
                });

                it('should show the expanded content', () => {
                  entry3.expand.should.have.been.calledOnce;
                });

                it('should focus the expanded content', () => {
                  entry3.focus.should.have.been.calledOnce;
                });

                it('should calculate the top positions', () => {
                  entry2.setTop.should.have.been.calledWith(0);
                  entry3.setTop.should.have.been.calledWith(1);
                  entry1.setTop.should.have.been.calledWith(9);
                  selectedIndicator.top.should.eql(1);
                });
              });
            });
          });
        });
      });
    });
  });
});
