import blessed from 'blessed';
import sinon from 'sinon';
import _ from 'lodash';

const helper = {
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
  return Object.assign(helper.box, {
    setContent: sinon.spy(),
    getLines: sinon.spy(() => helper.lines),
    setScrollPerc: sinon.spy(),
    getScrollPerc: sinon.spy(() => helper.scrollPerc),
    hide: sinon.spy(),
    show: sinon.spy(),
    focus: sinon.spy(),
    reset: () => {
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
