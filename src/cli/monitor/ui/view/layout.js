import _ from 'lodash';
import logger from '../../logger';
import blessed from 'blessed';
import {
  SELECTED_INDICATOR_PROPERTIES,
  RIGHT_POINTER,
  DOWN_POINTER,
  ENTRY_INDENT,
} from './constants';
import {
  HEADER_HEIGHT,
} from '../types/common/view/constants';
import EventEmitter from 'events';

export default class Layout extends EventEmitter {
  constructor(container) {
    super();
    this.container = container;
    this.entries = {};
    this.rectSelectors = {};
    logger.log('appending selected indicator');
    this.selectedIndicator = blessed.text(
      _.cloneDeep(SELECTED_INDICATOR_PROPERTIES)
    );
    this.selectedIndicator.on('click', () => {
      this.emit('toggleExpanded');
    });
    this.container.append(this.selectedIndicator);
  }
  append(name, entry) {
    logger.log(`appending ${name}`);
    entry.on('select', () => {
      this.emit('select', name);
    });
    this.entries[name] = entry;
    entry.setParent(this.container);
  }
  apply(state) {
    // istanbul ignore else
    if (state !== this.lastState) {
      this.lastState = state;
      const lines = state.lines;
      const selected = lines[state.selected];
      const totalHeaderHeight = lines.length * HEADER_HEIGHT;
      let top = 0;
      for (let name of lines) {
        const entry = this.entries[name];
        // the state starts with height and width 0
        const height = state.height || this.container.height;
        const width = state.width || this.container.width;
        const contentHeight = height - totalHeaderHeight;
        let topIncrement = HEADER_HEIGHT;
        if (name === selected) {
          logger.log(`setting selected indicator top to ${top}`);
          this.selectedIndicator.top = top;
          if (state.expanded) {
            topIncrement += contentHeight;
            entry.expand();
            this.selectedIndicator.content = DOWN_POINTER;
            entry.focus();
          } else {
            entry.collapse();
            this.selectedIndicator.content = RIGHT_POINTER;
            this.container.focus();
          }
        } else {
          entry.collapse();
        }
        // use a selector so that we get the same rect
        // object if the rect has not changed
        const rect = {
          top,
          left: ENTRY_INDENT,
          width: width - ENTRY_INDENT,
          height: contentHeight + HEADER_HEIGHT,
        };
        logger.log(`setting ${name} to ${rect}`);
        entry.layout(rect);
        top += topIncrement;
      }
    }
  }
}
