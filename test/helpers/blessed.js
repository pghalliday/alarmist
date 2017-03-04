import blessed from 'blessed';
import sinon from 'sinon';
import _ from 'lodash';

const TEST_CONTENT = 'test content';
const TEST_TEXT = 'test text';

const helper = {
  TEST_CONTENT: TEST_CONTENT,
  TEST_TEXT: TEST_TEXT,
  reset: () => {
    helper.text.reset();
    helper.box.reset();
  },
};

blessed.text = sinon.spy((props) => {
  helper.text = _.cloneDeep(props);
  return Object.assign(helper.text, {
    setContent: sinon.spy(),
    reset: () => {
      helper.text.setContent.reset();
    },
  });
});

blessed.box = sinon.spy((props) => {
  helper.box = _.cloneDeep(props);
  helper.box.keyHandlers = {};
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
    key: (keys, handler) => {
      for (let key of keys) {
        helper.box.keyHandlers[key] = handler;
      }
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

export default helper;
