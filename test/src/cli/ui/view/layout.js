import {createLayout} from '../../../../../src/cli/ui/view/layout';

let layout;
const screen = {
  append: sinon.spy(),
};
const element1 = {height: 10};
const element2 = {height: 5};
const element3 = {height: 15};

describe('cli', () => {
  describe('ui', () => {
    describe('view', () => {
      describe('layout', () => {
        before(() => {
          layout = createLayout(screen);
        });

        describe('append', () => {
          before(() => {
            screen.append.reset();
            layout.append(element1);
            layout.append(element2);
            layout.append(element3);
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
              layout.apply();
            });

            it('should calculate the top positions', () => {
              element1.top.should.eql(0);
              element2.top.should.eql(10);
              element3.top.should.eql(15);
            });
          });
        });
      });
    });
  });
});
