import {createStore} from './redux/store';
import {createService} from './service';
import {createView} from './view';

import exec from './types/log';
import spawn from './types/service';

import loadConfigFile from '../../../utils/load-config-file';
import modulePath from '../../../utils/module-path';

// istanbul ignore next
function createUi({monitor, configFile, workingDir, debug}) {
  const types = {
    log,
    service,
  };
  loadConfigFile(configFile).then((config) => {
    if (config.types) {
      Object.keys(config.types).forEach((type) => {
        types[type] = require(modulePath(config.types[type]));
      });
    }
    const store = createStore(types);
    const service = createService({monitor, store, types});
    createView({service, store, workingDir, debug, types});
  });
};

module.exports = {
  createUi,
};
