import blessed from 'blessed';
import {createLayout} from '../../../../../src/cli/ui/view/layout';
import {
  SELECTED_INDICATOR_PROPERTIES,
  RIGHT_POINTER,
  DOWN_POINTER,
} from '../../../../../src/cli/ui/view/constants';

let layout;
const program = {
  log: sinon.spy(),
};
const container = {
  append: sinon.spy(),
  height: 10,
  focus: sinon.spy(),
};
const label1 = 'label1';
const label2 = 'label2';
const label3 = 'label3';
const textElement1 = {height: 1};
const textElement2 = {height: 1};
const textElement3 = {height: 1};
const logElement1 = {
  height: 0,
  hide: sinon.spy(),
};
const logElement2 = {
  height: 0,
  hide: sinon.spy(),
};
const logElement3 = {
  height: 0,
  focus: sinon.spy(),
  show: sinon.spy(),
  hide: sinon.spy(),
};
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

const selectedIndicator = {style: {}};
const text = sinon.spy(() => selectedIndicator);

describe('cli', () => {
  describe('ui', () => {
    describe('view', () => {
      describe('layout', () => {
        before(() => {
          const fnText = blessed.text;
          text.reset();
          blessed.text = text;
          container.append.reset();
          layout = createLayout(program, container);
          blessed.text = fnText;
        });

        it('should create the selected indicator', () => {
          text.should.have.been.calledWith(SELECTED_INDICATOR_PROPERTIES);
        });

        it('should append the selected indicator', () => {
          container.append.should.have.been.calledWith(
            sinon.match.same(selectedIndicator)
          );
        });

        describe('append', () => {
          before(() => {
            container.append.reset();
            layout.append(label1, textElement1, logElement1);
            layout.append(label2, textElement2, logElement2);
            layout.append(label3, textElement3, logElement3);
          });

          it('should append to the container', () => {
            container.append.should.have.been.calledWith(
              sinon.match.same(textElement1)
            );
            container.append.should.have.been.calledWith(
              sinon.match.same(textElement2)
            );
            container.append.should.have.been.calledWith(
              sinon.match.same(textElement3)
            );
            container.append.should.have.been.calledWith(
              sinon.match.same(logElement1)
            );
            container.append.should.have.been.calledWith(
              sinon.match.same(logElement2)
            );
            container.append.should.have.been.calledWith(
              sinon.match.same(logElement3)
            );
          });

          describe('then apply', () => {
            describe('when not expanded', () => {
              before(() => {
                logElement1.hide.reset();
                logElement2.hide.reset();
                logElement3.hide.reset();
                container.focus.reset();
                layout.apply(notExpandedState);
              });

              it('should set the selected indicator to a right pointer', () => {
                selectedIndicator.content.should.eql(RIGHT_POINTER);
              });

              it('should focus the container', () => {
                container.focus.should.have.been.calledOnce;
              });

              it('should preset the log heights', () => {
                logElement1.height.should.eql(7);
                logElement2.height.should.eql(7);
                logElement3.height.should.eql(7);
              });

              it('should hide the logs', () => {
                logElement1.hide.should.have.been.calledOnce;
                logElement2.hide.should.have.been.calledOnce;
                logElement3.hide.should.have.been.calledOnce;
              });

              it('should calculate the top positions', () => {
                textElement2.top.should.eql(0);
                logElement2.top.should.eql(1);
                textElement3.top.should.eql(1);
                logElement3.top.should.eql(2);
                textElement1.top.should.eql(2);
                logElement1.top.should.eql(3);
                selectedIndicator.top.should.eql(1);
              });

              describe('then apply with the same state', () => {
                before(() => {
                  program.log.reset();
                  layout.apply(notExpandedState);
                });

                it('should do nothing', () => {
                  program.log.should.not.have.been.called;
                });
              });
            });

            describe('when expanded', () => {
              before(() => {
                logElement1.hide.reset();
                logElement2.hide.reset();
                logElement3.hide.reset();
                logElement3.show.reset();
                logElement3.focus.reset();
                layout.apply(expandedState);
              });

              it('should set the selected indicator to a down pointer', () => {
                selectedIndicator.content.should.eql(DOWN_POINTER);
              });

              it('should preset the log heights', () => {
                logElement1.height.should.eql(7);
                logElement2.height.should.eql(7);
                logElement3.height.should.eql(7);
              });

              it('should hide the logs', () => {
                logElement1.hide.should.have.been.calledOnce;
                logElement2.hide.should.have.been.calledOnce;
                logElement3.hide.should.have.been.calledOnce;
              });

              it('should show the expanded log', () => {
                logElement3.show.should.have.been.calledOnce;
              });

              it('should focus the expanded log', () => {
                logElement3.focus.should.have.been.calledOnce;
              });

              it('should calculate the top positions', () => {
                textElement2.top.should.eql(0);
                logElement2.top.should.eql(1);
                textElement3.top.should.eql(1);
                logElement3.top.should.eql(2);
                textElement1.top.should.eql(9);
                logElement1.top.should.eql(10);
                selectedIndicator.top.should.eql(1);
              });
            });
          });
        });
      });
    });
  });
});
