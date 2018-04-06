import Run from './run';

import {
  runLog,
} from '../redux/actions';

import SimpleJSONDocStream from 'simple-json-doc-stream';

/**
 * Expects log entries to come in single line JSON documents
 * with the following structure
 *
 *   {
 *     type: <DATA_TYPE>,
 *     data: <LOG_DATA>
 *   }
 */
export default class JSONLog extends Run {
  constructor(type, params) {
    super(params);
    const {store, status: name} = params;
    this.stream = new SimpleJSONDocStream();
    this.stream.on('error', (_error) => {
      // TODO: log error in debug mode
    });
    this.stream.on('parsed', (parsed) => {
      if (parsed.type === type) {
        const data = parsed.data;
        store.dispatch(runLog({
          name,
          type,
          data,
        }));
      } else {
        // TODO: log error in debug mode
      }
    });
  }

  log(logData) {
    this.stream.write(logData.data);
  }
}
