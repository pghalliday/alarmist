import {createStore} from 'redux';
import {createReducer} from './redux/reducer';
import {createService} from './service';
import {createView} from './view';

import task from './types/task';
import service from './types/service';

import loadConfigFile from '../../../utils/load-config-file';
import modulePath from '../../../utils/module-path';

// istanbul ignore next
async function createUi({screen, monitor, configFile, workingDir}) {
  const types = {
    task,
    service,
  };
  const config = await loadConfigFile(configFile);
  if (config.types) {
    Object.keys(config.types).forEach((type) => {
      types[type] = require(modulePath(config.types[type]));
    });
  }
  const reducer = createReducer(types, screen);
  const store = createStore(reducer);
  const uiService = createService({monitor, store, types});
  createView({screen, service: uiService, store, workingDir, types});
};

module.exports = {
  createUi,
};
