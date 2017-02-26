import _ from 'lodash';
import blessed from 'blessed';
import {
  HEADER_PROPERTIES,
  LOG_PROPERTIES,
} from './constants';

export default class Entry {
  constructor() {
    this.header = blessed.text(_.cloneDeep(HEADER_PROPERTIES));
    this.log = blessed.box(_.cloneDeep(LOG_PROPERTIES));
    this.clear();
  }
  setParent(container) {
    container.append(this.header);
    container.append(this.log);
  }
  _update() {
  }
  update(state) {
    if (this.state !== state) {
      this.state = state;
      this._update(state);
    }
  }
  setHeader(content, color) {
    this.header.content = content;
    this.header.style.bg = color;
  }
  clear() {
    this.log.content = '';
  }
  _setLog(data) {
    this.log.content = data.toString();
  }
  setLog(data) {
    if (data !== this.logData) {
      this.logData = data;
      this._setLog(data);
    }
  }
  getHeaderHeight() {
    return this.header.height;
  }
  setLogHeight(height) {
    this.log.height = height;
  }
  setTop(top) {
    this.header.top = top;
    this.log.top = top + this.header.height;
  }
  collapse() {
    this.log.hide();
  }
  expand() {
    this.log.show();
  }
  focus() {
    this.log.focus();
  }
}
