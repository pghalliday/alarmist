import {createStore} from 'redux';
import {createReducer} from './redux/reducer';
import {createService} from './service';
import {createView} from './view';
import cleanup from '../cleanup';

import task from './types/task';
import service from './types/service';

import loadConfigFile from '../../../utils/load-config-file';

// istanbul ignore next
async function createUi({screen, monitor, configFile, workingDir}) {
  const config = await loadConfigFile(configFile);
  const types = Object.assign({
    task,
    service,
  }, config.types);
  const reducer = createReducer(types, screen);
  const store = createStore(reducer);
  const uiService = createService({monitor, store, types});
  cleanup.register(uiService.stop.bind(uiService));
  createView({screen, store, workingDir, types});
};

module.exports = {
  createUi,
};
