import _ from 'lodash';
import blessed from 'blessed';
import {
  SELECTED_INDICATOR_PROPERTIES,
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
    append: (label, element) => {
      elements[label] = element;
      screen.append(element);
      screen.log(`appended ${label}`);
    },
    apply: (state) => {
      if (state !== lastState) {
        lastState = state;
        const lines = state.lines;
        const selected = lines[state.selected];
        let top = 0;
        for (let label of lines) {
          if (label === selected) {
            selectedIndicator.top = top;
            screen.log(`set selected indicator top to ${top}`);
          }
          const element = elements[label];
          element.top = top;
          screen.log(`set ${label} top to ${top}`);
          top += element.height;
        }
      }
    },
  };
}
