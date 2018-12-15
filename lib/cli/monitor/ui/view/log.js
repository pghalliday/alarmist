"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _clipboardy = require("clipboardy");

var _blessed = _interopRequireDefault(require("blessed"));

var _constants = require("./constants");

var _entry = _interopRequireDefault(require("./entry"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Log extends _entry.default {
  constructor() {
    super();
    this.scrollOnExpand = true;
    this.expanded = false;
    this.log = _blessed.default.box(_lodash.default.cloneDeep(_constants.LOG_PROPERTIES));
    this.log.key(['y'], () => (0, _clipboardy.writeSync)(this.log.getText()));
    this.log.key(['S-y'], () => (0, _clipboardy.writeSync)(this.log.getContent()));
    this.log.on('mouse', event => {
      // istanbul ignore else
      if (event.action === 'mousedown') {
        // istanbul ignore else
        if (event.shift) {
          if (event.button === 'left') {
            (0, _clipboardy.writeSync)(this.log.getText());
          }

          if (event.button === 'right') {
            (0, _clipboardy.writeSync)(this.log.getContent());
          }
        }
      }
    });
    this.log.hide();
    this.clear();
  }

  _setContentParent(container) {
    container.append(this.log);
  }

  _update() {}

  clear() {
    this.log.setContent('');
  } // istanbul ignore next


  _setLog(data) {
    let scroll = false;
    let scrolling = false;
    const height = this.log.height;

    if (this.expanded) {
      const beforeLineCount = this.log.getLines().length;

      if (beforeLineCount > height) {
        scrolling = true;
        scroll = this.log.getScrollPerc() === 100;
      }
    }

    this.log.setContent(data.toString());

    if (this.expanded) {
      if (!scroll) {
        const afterLineCount = this.log.getLines().length;

        if (!scrolling) {
          scroll = afterLineCount > height;
        }
      }

      if (scroll) {
        this.log.setScrollPerc(100);
      }
    }
  }

  setLog(data) {
    if (data !== this.logData) {
      this.logData = data;

      this._setLog(data);
    }
  }

  setContentHeight(height) {
    this.log.height = height;
  }

  _setContentTop(top) {
    this.log.top = top;
  } // istanbul ignore next


  collapse() {
    if (this.expanded) {
      const height = this.log.height;
      const lineCount = this.log.getLines().length;

      if (lineCount <= height) {
        this.scrollOnExpand = true;
      } else {
        this.scrollOnExpand = this.log.getScrollPerc() === 100;
      }

      this.expanded = false;
      this.log.hide();
    }
  } // istanbul ignore next


  expand() {
    if (!this.expanded) {
      this.log.show();
      this.expanded = true;

      if (this.scrollOnExpand) {
        const height = this.log.height;
        const lineCount = this.log.getLines().length;

        if (lineCount > height) {
          this.log.setScrollPerc(100);
        }
      }
    }
  }

  focus() {
    this.log.focus();
  }

}

exports.default = Log;