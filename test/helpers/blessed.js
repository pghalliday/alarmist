import blessed from 'blessed';
import sinon from 'sinon';
import _ from 'lodash';

const helper = {};

blessed.text = sinon.spy((props) => {
  helper.text = _.cloneDeep(props);
  return helper.text;
});

blessed.box = sinon.spy((props) => {
  helper.box = _.cloneDeep(props);
  return Object.assign(helper.box, {
    hide: sinon.spy(),
    show: sinon.spy(),
    focus: sinon.spy(),
  });
});

export default helper;
