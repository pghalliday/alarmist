import blessed from 'blessed';
import {createLayout} from '../../../../../src/cli/ui/view/layout';
import {
  SELECTED_INDICATOR_PROPERTIES,
} from '../../../../../src/cli/ui/view/constants';

let layout;
const screen = {
  append: sinon.spy(),
  log: sinon.spy(),
};
const label1 = 'label1';
const label2 = 'label2';
const label3 = 'label3';
const element1 = {height: 10};
const element2 = {height: 5};
const element3 = {height: 15};
const state = {
  lines: [
    label2,
    label3,
    label1,
  ],
  selected: 1,
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
          screen.append.reset();
          layout = createLayout(screen);
          blessed.text = fnText;
        });

        it('should create the selected indicator', () => {
          text.should.have.been.calledWith(SELECTED_INDICATOR_PROPERTIES);
        });

        it('should append the selected indicator', () => {
          screen.append.should.have.been.calledWith(
            sinon.match.same(selectedIndicator)
          );
        });

        describe('append', () => {
          before(() => {
            screen.append.reset();
            layout.append(label1, element1);
            layout.append(label2, element2);
            layout.append(label3, element3);
          });

          it('should append to the screen', () => {
            screen.append.should.have.been.calledWith(
              sinon.match.same(element1)
            );
            screen.append.should.have.been.calledWith(
              sinon.match.same(element2)
            );
            screen.append.should.have.been.calledWith(
              sinon.match.same(element3)
            );
          });

          describe('then apply', () => {
            before(() => {
              layout.apply(state);
            });

            it('should calculate the top positions', () => {
              element2.top.should.eql(0);
              element3.top.should.eql(5);
              element1.top.should.eql(20);
              selectedIndicator.top.should.eql(5);
            });

            describe('then apply with the same state', () => {
              before(() => {
                screen.log.reset();
                layout.apply(state);
              });

              it('should do nothing', () => {
                screen.log.should.not.have.been.called;
              });
            });
          });
        });
      });
    });
  });
});
