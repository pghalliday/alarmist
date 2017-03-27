import _ from 'lodash';
import logger from './logger';
import blessed from 'blessed';
import {
  SELECTED_INDICATOR_PROPERTIES,
  RIGHT_POINTER,
  DOWN_POINTER,
} from './constants';
import EventEmitter from 'events';

export default class Layout extends EventEmitter {
  constructor(container) {
    super();
    this.container = container;
    this.entries = {};
    logger.log('appending selected indicator');
    this.selectedIndicator = blessed.text(
      _.cloneDeep(SELECTED_INDICATOR_PROPERTIES)
    );
    this.selectedIndicator.on('click', () => {
      this.emit('toggleExpanded');
    });
    this.container.append(this.selectedIndicator);
  }
  append(label, entry) {
    logger.log(`appending ${label}`);
    entry.on('select', () => {
      this.emit('select', label);
    });
    this.entries[label] = entry;
    entry.setParent(this.container);
  }
  apply(state) {
    if (state !== this.lastState) {
      this.lastState = state;
      const lines = state.lines;
      const selected = lines[state.selected];
      const totalHeaderHeight = _.reduce(
        this.entries,
        (total, entry) => {
          return total + entry.getHeaderHeight();
        },
        0
      );
      let top = 0;
      for (let label of lines) {
        const entry = this.entries[label];
        const realLogHeight = this.container.height - totalHeaderHeight;
        entry.setLogHeight(realLogHeight);
        entry.collapse();
        let logHeight = 0;
        if (label === selected) {
          logger.log(`setting selected indicator top to ${top}`);
          this.selectedIndicator.top = top;
          if (state.expanded) {
            this.selectedIndicator.content = DOWN_POINTER;
            entry.expand();
            entry.focus();
            logHeight = realLogHeight;
          } else {
            this.selectedIndicator.content = RIGHT_POINTER;
            this.container.focus();
          }
        }
        logger.log(`setting ${label} top to ${top}`);
        entry.setTop(top);
        top += entry.getHeaderHeight();
        top += logHeight;
      }
    }
  }
}
