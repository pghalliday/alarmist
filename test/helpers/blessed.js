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
    if (helper.table) {
      helper.table.reset();
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
      helper.text.setContent.reset();
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

blessed.table = sinon.spy((props) => {
  helper.table = _.cloneDeep(props);
  return Object.assign(helper.table, {
    setData: sinon.spy(),
    hide: sinon.spy(),
    show: sinon.spy(),
    focus: sinon.spy(),
    reset: () => {
      helper.table.setData.reset();
      helper.table.hide.reset();
      helper.table.show.reset();
      helper.table.focus.reset();
    },
  });
});

export default helper;
