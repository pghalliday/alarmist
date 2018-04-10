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
  append(name, entry) {
    logger.log(`appending ${name}`);
    entry.on('select', () => {
      this.emit('select', name);
    });
    this.entries[name] = entry;
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
      for (let name of lines) {
        const entry = this.entries[name];
        // the state starts with height 0, so first we measure the height
        const height = state.height || this.container.height;
        const realContentHeight = height - totalHeaderHeight;
        entry.setContentHeight(realContentHeight);
        entry.collapse();
        let contentHeight = 0;
        if (name === selected) {
          logger.log(`setting selected indicator top to ${top}`);
          this.selectedIndicator.top = top;
          if (state.expanded) {
            this.selectedIndicator.content = DOWN_POINTER;
            entry.expand();
            entry.focus();
            contentHeight = realContentHeight;
          } else {
            this.selectedIndicator.content = RIGHT_POINTER;
            this.container.focus();
          }
        }
        logger.log(`setting ${name} top to ${top}`);
        entry.setTop(top);
        top += entry.getHeaderHeight();
        top += contentHeight;
      }
    }
  }
}
