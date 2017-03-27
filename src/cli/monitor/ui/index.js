import store from './redux/store';
import {createService} from './service';
import {createView} from './view';

// istanbul ignore next
function createUi(monitor, workingDir, debug) {
  const service = createService(monitor, store);
  createView(service, store, workingDir, debug);
};

module.exports = {
  createUi,
};
