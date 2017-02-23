import _ from 'lodash';
import blessed from 'blessed';
import {
  SELECTED_INDICATOR_PROPERTIES,
  RIGHT_POINTER,
  DOWN_POINTER,
} from './constants';

export function createLayout(program, container) {
  let lastState;
  const elements = {};
  program.log('appending selected indicator');
  const selectedIndicator = blessed.text(
    _.cloneDeep(SELECTED_INDICATOR_PROPERTIES)
  );
  container.append(selectedIndicator);
  return {
    append: (label, header, log) => {
      program.log(`appending ${label}`);
      elements[label] = {
        header: header,
        log: log,
      };
      container.append(header);
      container.append(log);
    },
    apply: (state) => {
      if (state !== lastState) {
        lastState = state;
        const lines = state.lines;
        const selected = lines[state.selected];
        const totalHeaderHeight = _.reduce(
          elements,
          (total, subElements) => {
            return total + subElements.header.height;
          },
          0
        );
        let top = 0;
        for (let label of lines) {
          const subElements = elements[label];
          const header = subElements.header;
          const log = subElements.log;
          log.height = container.height - totalHeaderHeight;
          log.hide();
          let logHeight = 0;
          if (label === selected) {
            program.log(`setting selected indicator top to ${top}`);
            selectedIndicator.top = top;
            if (state.expanded) {
              selectedIndicator.content = DOWN_POINTER;
              log.show();
              log.focus();
              logHeight = log.height;
            } else {
              selectedIndicator.content = RIGHT_POINTER;
              container.focus();
            }
          }
          program.log(`setting ${label} top to ${top}`);
          header.top = top;
          top += header.height;
          log.top = top;
          top += logHeight;
        }
      }
    },
  };
}
