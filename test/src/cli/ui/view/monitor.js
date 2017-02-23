import blessed from 'blessed';
import {createMonitor} from '../../../../../src/cli/ui/view/monitor';
import {
  TEXT_PROPERTIES,
} from '../../../../../src/cli/ui/view/constants';
import {
  MONITOR_LABEL,
} from '../../../../../src/cli/ui/constants';

let monitor;

const element = {style: {}};
const text = sinon.spy(() => element);
const layout = {
  append: sinon.spy(),
};

describe('cli', () => {
  describe('ui', () => {
    describe('view', () => {
      describe('monitor', () => {
        before(() => {
          const fnText = blessed.text;
          text.reset();
          blessed.text = text;
          monitor = createMonitor(layout);
          blessed.text = fnText;
        });

        it('should construct a text element', () => {
          text.should.have.been.calledWith(TEXT_PROPERTIES);
        });

        it('should append the element to the layout', () => {
          layout.append.should.have.been.calledWith(
            MONITOR_LABEL,
            sinon.match.same(element)
          );
        });

        describe('update', () => {
          describe('with an exit code', () => {
            before(() => {
              monitor.update({
                exitCode: 0,
              });
            });

            it('should go red', () => {
              element.style.bg.should.eql('red');
            });

            it('should display the exit code', () => {
              element.content.should.eql(' monitor: exited: 0');
            });
          });

          describe('without an exit code', () => {
            before(() => {
              monitor.update({});
            });

            it('should go green', () => {
              element.style.bg.should.eql('green');
            });

            it('should display ok', () => {
              element.content.should.eql(' monitor: ok');
            });
          });
        });
      });
    });
  });
});
