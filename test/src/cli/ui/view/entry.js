import blessed from 'blessed';
import {createEntry} from '../../../../../src/cli/ui/view/entry';
import {
  HEADER_PROPERTIES,
  LOG_PROPERTIES,
} from '../../../../../src/cli/ui/view/constants';

let entry;

const textElement = {style: {}};
const text = sinon.spy(() => textElement);
const logElement = {
  log: sinon.spy(),
};
const log = sinon.spy(() => logElement);
const layout = {
  append: sinon.spy(),
};
const label = 'label';

describe('cli', () => {
  describe('ui', () => {
    describe('view', () => {
      describe('entry', () => {
        before(() => {
          const fnText = blessed.text;
          text.reset();
          blessed.text = text;
          const fnLog = blessed.log;
          log.reset();
          blessed.log = log;
          entry = createEntry(label, layout);
          blessed.text = fnText;
          blessed.log = fnLog;
        });

        it('should construct a text element', () => {
          text.should.have.been.calledWith(HEADER_PROPERTIES);
        });

        it('should construct a log element', () => {
          log.should.have.been.calledWith(LOG_PROPERTIES);
        });

        it('should append the elements to the layout', () => {
          layout.append.should.have.been.calledWith(
            label,
            sinon.match.same(textElement),
            sinon.match.same(logElement),
          );
        });

        describe('setHeader', () => {
          before(() => {
            entry.setHeader('content', 'color');
          });

          it('should set the text element content', () => {
            textElement.content.should.eql('content');
          });

          it('should set the text element color', () => {
            textElement.style.bg.should.eql('color');
          });
        });

        describe('log', () => {
          before(() => {
            logElement.log.reset();
            entry.log('log data');
          });

          it('should append to the log box', () => {
            logElement.log.should.have.been.calledWith('log data');
          });
        });

        describe('clear', () => {
          before(() => {
            logElement.content = 'log data';
            entry.clear();
          });

          it('should clear the log box', () => {
            logElement.content.should.eql('');
          });
        });
      });
    });
  });
});
