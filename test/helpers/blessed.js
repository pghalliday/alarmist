import blessed from 'blessed';
import sinon from 'sinon';
import _ from 'lodash';

const TEST_CONTENT = 'test content';
const TEST_TEXT = 'test text';
const TEST_WIDTH = 200;
const TEST_HEIGHT = 100;

const helper = {
  TEST_CONTENT: TEST_CONTENT,
  TEST_TEXT: TEST_TEXT,
  TEST_WIDTH: TEST_WIDTH,
  TEST_HEIGHT: TEST_HEIGHT,
  reset: () => {
    if (helper.text) {
      helper.text.reset();
    }
    if (helper.box) {
      helper.box.reset();
    }
    if (helper.screen) {
      helper.screen.reset();
    }
  },
};

blessed.screen = sinon.spy((props) => {
  helper.screen = Object.assign({}, {
  }, _.cloneDeep(props));
  return Object.assign(helper.screen, {
    width: TEST_WIDTH,
    height: TEST_HEIGHT,
    log: sinon.spy(),
    debug: sinon.spy(),
    reset: () => {
      helper.screen.width = TEST_WIDTH;
      helper.screen.height = TEST_HEIGHT;
      helper.screen.log.reset();
      helper.screen.debug.reset();
    },
  });
});

blessed.text = sinon.spy((props) => {
  helper.text = Object.assign({}, {
    style: {},
  }, _.cloneDeep(props));
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
      helper.text.setContent.reset();
      delete helper.text.top;
      delete helper.text.left;
      delete helper.text.width;
      delete helper.text.height;
      delete helper.text.style.bg;
      delete helper.text.style.fg;
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
      for (let key of keys) {
        keyHandlers[key] = handler;
      }
    },
    pressKey: (key) => {
      keyHandlers[key]();
    },
    reset: () => {
      delete helper.box.top;
      delete helper.box.left;
      delete helper.box.width;
      delete helper.box.height;
      helper.box.getContent.reset();
      helper.box.getText.reset();
      helper.box.setContent.reset();
      helper.box.getLines.reset();
      helper.box.setScrollPerc.reset();
      helper.box.getScrollPerc.reset();
      helper.box.hide.reset();
      helper.box.show.reset();
      helper.box.focus.reset();
    },
  });
});

export default helper;
