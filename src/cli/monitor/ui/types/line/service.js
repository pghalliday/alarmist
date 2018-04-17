import Service from '../common/service';
import JSONStream from '../common/utils/json-stream';
import {
  lineStart,
  lineColors,
  lineAdvance,
  lineValue,
  lineEnd,
} from './reducer';

const type = 'line';

const actions = [
  lineColors,
  lineAdvance,
  lineValue,
];

class LineService extends Service {
  constructor(store) {
    super(store);
    this.jsonStream = new JSONStream({
      store,
      type,
      actions,
    });
  }
  start(status) {
    super.start(status);
    this.store.dispatch(lineStart(status));
  }
  log(status) {
    this.jsonStream.write(status);
  }
  end(status) {
    this.store.dispatch(lineEnd(status));
  }
}

export default function createService(store) {
  return new LineService(store);
}
