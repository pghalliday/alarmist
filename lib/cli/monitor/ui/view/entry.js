"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _blessed = _interopRequireDefault(require("blessed"));

var _constants = require("./constants");

var _events = _interopRequireDefault(require("events"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Entry extends _events.default {
  constructor() {
    super();
    this.header = _blessed.default.text(_lodash.default.cloneDeep(_constants.HEADER_PROPERTIES));
    this.header.on('click', () => {
      this.emit('select');
    });
  }

  _setContentParent(_container) {}

  setParent(container) {
    container.append(this.header);

    this._setContentParent(container);
  }

  _update(_status) {}

  update(status) {
    if (this.status !== status) {
      this.status = status;

      this._update(status);
    }
  }

  setHeader(content, color) {
    this.header.setContent(content);
    this.header.style.bg = color;
  } // istanbul ignore next


  getHeaderHeight() {
    return this.header.height;
  }

  setContentHeight(_height) {}

  _setContentTop(_top) {}

  setTop(top) {
    this.header.top = top;

    this._setContentTop(top + this.header.height);
  } // istanbul ignore next


  collapse() {} // istanbul ignore next


  expand() {}

  focus() {}

}

exports.default = Entry;