import blessed from 'blessed';
import sinon from 'sinon';
import _ from 'lodash';

const TEST_CONTENT = 'test content';
const TEST_TEXT = 'test text';

const helper = {
  TEST_CONTENT: TEST_CONTENT,
  TEST_TEXT: TEST_TEXT,
  reset: () => {
    if (helper.text) {
      helper.text.reset();
    }
    if (helper.box) {
      helper.box.reset();
    }
  },
};

blessed.text = sinon.spy((props) => {
  helper.text = _.cloneDeep(props);
  const handlers = {};
  return Object.assign(helper.text, {
    setContent: sinon.spy(),
    on: (name, callback) => {
      handlers[name] = callback;
    },
    click: () => {
      handlers['click']();
    },
    reset: () => {
      helper.text.setContent.resetHistory();
    },
  });
});

blessed.box = sinon.spy((props) => {
  helper.box = _.cloneDeep(props);
  const keyHandlers = {};
  const handlers = {};
  return Object.assign(helper.box, {
    getContent: sinon.spy(() => TEST_CONTENT),
    getText: sinon.spy(() => TEST_TEXT),
    setContent: sinon.spy(),
    getLines: sinon.spy(() => helper.lines),
    setScrollPerc: sinon.spy(),
    getScrollPerc: sinon.spy(() => helper.scrollPerc),
    hide: sinon.spy(),
    show: sinon.spy(),
    focus: sinon.spy(),
    on: (name, callback) => {
      handlers[name] = callback;
    },
    shiftClick: () => {
      handlers['mouse']({
        button: 'left',
        shift: true,
        action: 'mousedown',
      });
    },
    shiftRightClick: () => {
      handlers['mouse']({
        button: 'right',
        shift: true,
        action: 'mousedown',
      });
    },
    key: (keys, handler) => {
      for (const key of keys) {
        keyHandlers[key] = handler;
      }
    },
    pressKey: (key) => {
      keyHandlers[key]();
    },
    reset: () => {
      helper.box.getContent.resetHistory();
      helper.box.getText.resetHistory();
      helper.box.setContent.resetHistory();
      helper.box.getLines.resetHistory();
      helper.box.setScrollPerc.resetHistory();
      helper.box.getScrollPerc.resetHistory();
      helper.box.hide.resetHistory();
      helper.box.show.resetHistory();
      helper.box.focus.resetHistory();
    },
  });
});

export default helper;
