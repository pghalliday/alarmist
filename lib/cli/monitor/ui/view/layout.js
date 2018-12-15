"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _logger = _interopRequireDefault(require("./logger"));

var _blessed = _interopRequireDefault(require("blessed"));

var _constants = require("./constants");

var _events = _interopRequireDefault(require("events"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Layout extends _events.default {
  constructor(container) {
    super();
    this.container = container;
    this.entries = {};

    _logger.default.log('appending selected indicator');

    this.selectedIndicator = _blessed.default.text(_lodash.default.cloneDeep(_constants.SELECTED_INDICATOR_PROPERTIES));
    this.selectedIndicator.on('click', () => {
      this.emit('toggleExpanded');
    });
    this.container.append(this.selectedIndicator);
  }

  append(label, entry) {
    _logger.default.log(`appending ${label}`);

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

      const totalHeaderHeight = _lodash.default.reduce(this.entries, (total, entry) => {
        return total + entry.getHeaderHeight();
      }, 0);

      let top = 0;

      for (const label of lines) {
        const entry = this.entries[label]; // the state starts with height 0, so first we measure the height

        const height = state.height || this.container.height;
        const realContentHeight = height - totalHeaderHeight;
        entry.setContentHeight(realContentHeight);
        entry.collapse();
        let contentHeight = 0;

        if (label === selected) {
          _logger.default.log(`setting selected indicator top to ${top}`);

          this.selectedIndicator.top = top;

          if (state.expanded) {
            this.selectedIndicator.content = _constants.DOWN_POINTER;
            entry.expand();
            entry.focus();
            contentHeight = realContentHeight;
          } else {
            this.selectedIndicator.content = _constants.RIGHT_POINTER;
            this.container.focus();
          }
        }

        _logger.default.log(`setting ${label} top to ${top}`);

        entry.setTop(top);
        top += entry.getHeaderHeight();
        top += contentHeight;
      }
    }
  }

}

exports.default = Layout;