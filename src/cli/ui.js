import store from './redux/store';
import {createService} from './service';
import {createView} from './view';

// istanbul ignore next
function createUi(monitor) {
  createService(monitor, store);
  createView(store);
};

module.exports = {
  createUi,
};
