import tail from 'tail';
import blessed from 'blessed';
import {createEntry} from '../../../../../src/cli/ui/view/entry';
import {
  HEADER_PROPERTIES,
  LOG_PROPERTIES,
  TAIL_OPTIONS,
} from '../../../../../src/cli/ui/view/constants';
import EventEmitter from 'events';

let entry;

let oldTail;
let lastTail;
const Tail = class extends EventEmitter {
  constructor(filePath, options) {
    super();
    lastTail = this;
    this.filePath = filePath;
    this.options = options;
  }
};
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

        describe('setLog', () => {
          before(() => {
            logElement.log.reset();
            logElement.content = 'some content';
            const fnTail = tail.Tail;
            tail.Tail = Tail;
            entry.setLog('logFilePath');
            lastTail.emit('line', 'line 1');
            lastTail.emit('line', 'line 2');
            tail.Tail = fnTail;
          });

          it('should reset the log content', () => {
            logElement.content.should.eql('');
          });

          it('should tail the log file to the log box', () => {
            lastTail.filePath.should.eql('logFilePath');
            lastTail.options.should.eql(TAIL_OPTIONS);
            logElement.log.should.have.been.calledWith('line 1');
            logElement.log.should.have.been.calledWith('line 2');
          });

          describe('after setting a new log', () => {
            before(() => {
              logElement.log.reset();
              oldTail = lastTail;
              oldTail.unwatch = sinon.spy();
              const fnTail = tail.Tail;
              tail.Tail = Tail;
              entry.setLog('logFilePath');
              oldTail.emit('line', 'line 3');
              oldTail.emit('line', 'line 4');
              tail.Tail = fnTail;
            });

            it('should stop listening on the old log', () => {
              oldTail.unwatch.should.have.been.calledOnce;
              logElement.log.should.not.have.been.called;
            });
          });
        });
      });
    });
  });
});
