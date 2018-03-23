import _ from 'lodash';
import blessed from 'blessed';
import {
  HEADER_PROPERTIES,
} from './constants';
import EventEmitter from 'events';

export default class Entry extends EventEmitter {
  constructor() {
    super();
    this.header = blessed.text(_.cloneDeep(HEADER_PROPERTIES));
    this.header.on('click', () => {
      this.emit('select');
    });
  }
  _setContentParent(_container) {
  }
  setParent(container) {
    container.append(this.header);
    this._setContentParent(container);
  }
  _update(_status) {
  }
  update(status) {
    if (this.status !== status) {
      this.status = status;
      this._update(status);
    }
  }
  setHeader(content, color) {
    this.header.setContent(content);
    this.header.style.bg = color;
  }
  // istanbul ignore next
  getHeaderHeight() {
    return this.header.height;
  }
  setContentHeight(_height) {
  }
  _setContentTop(_top) {
  }
  setTop(top) {
    this.header.top = top;
    this._setContentTop(top + this.header.height);
  }
  // istanbul ignore next
  collapse() {
  }
  // istanbul ignore next
  expand() {
  }
  focus() {
  }
}
