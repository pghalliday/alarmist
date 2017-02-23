import _ from 'lodash';
import blessed from 'blessed';
import {
  SELECTED_INDICATOR_PROPERTIES,
  RIGHT_POINTER,
  DOWN_POINTER,
} from './constants';

export function createLayout(screen) {
  let lastState;
  const elements = {};
  const selectedIndicator = blessed.text(
    _.cloneDeep(SELECTED_INDICATOR_PROPERTIES)
  );
  screen.append(selectedIndicator);
  screen.log('appended selected indicator');
  return {
    append: (label, header, log) => {
      elements[label] = {
        header: header,
        log: log,
      };
      screen.append(header);
      screen.append(log);
      screen.log(`appended ${label}`);
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
          log.height = 0;
          if (label === selected) {
            selectedIndicator.top = top;
            screen.log(`set selected indicator top to ${top}`);
            if (state.expanded) {
              selectedIndicator.content = DOWN_POINTER;
              log.height = screen.height - totalHeaderHeight;
              log.setScrollPerc(100);
              log.focus();
            } else {
              selectedIndicator.content = RIGHT_POINTER;
              header.focus();
            }
          }
          header.top = top;
          top += header.height;
          log.top = top;
          top += log.height;
          screen.log(`set ${label} top to ${top}`);
        }
      }
    },
  };
}
