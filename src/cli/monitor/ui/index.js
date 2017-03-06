import store from './redux/store';
import {createService} from './service';
import {createView} from './view';

// istanbul ignore next
function createUi(monitor, workingDir) {
  const service = createService(monitor, store);
  createView(service, store, workingDir);
};

module.exports = {
  createUi,
};
