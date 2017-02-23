import _ from 'lodash';
import {Tail} from 'tail';
import blessed from 'blessed';
import {
  TEXT_PROPERTIES,
  LOG_PROPERTIES,
  TAIL_OPTIONS,
} from './constants';

function createEntry(label, layout) {
  const textElement = blessed.text(_.cloneDeep(TEXT_PROPERTIES));
  const logElement = blessed.log(_.cloneDeep(LOG_PROPERTIES));
  let tail;
  const onLine = (data) => {
    logElement.log(data);
  };
  layout.append(label, textElement, logElement);
  return {
    setHeader: (content, color) => {
      textElement.content = content;
      textElement.style.bg = color;
    },
    setLog: (logFilePath) => {
      if(!_.isUndefined(tail)) {
        tail.unwatch();
        tail.removeListener('line', onLine);
      }
      tail = new Tail(logFilePath, TAIL_OPTIONS);
      tail.on('line', onLine);
    },
  };
}

module.exports = {
  createEntry,
};
