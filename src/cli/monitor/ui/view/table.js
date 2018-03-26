import _ from 'lodash';
import blessed from 'blessed';
import {
  TABLE_PROPERTIES,
} from './constants';
import Entry from './entry';

const _STATUS_COLORS = ['green', 'yellow', 'red'];

function _jobContent(status) {
  let message = 'ok';
  return ` ${status.name}: ${message}`;
}

function _jobBg(_status) {
  return 'green';
}

export default class Table extends Entry {
  constructor() {
    super();
    this.expanded = false;
    this.table = blessed.table(_.cloneDeep(TABLE_PROPERTIES));
    this.table.hide();
    this.clear();
  }
  _setContentParent(container) {
    container.append(this.table);
  }
  _update(_status) {
  }
  clear() {
    this.table.setData([]);
  }
  setContentHeight(height) {
    this.table.height = height;
  }
  _setContentTop(top) {
    this.table.top = top;
  }
  collapse() {
    if (this.expanded) {
      this.expanded = false;
      this.table.hide();
    }
  }
  expand() {
    if (!this.expanded) {
      this.table.show();
      this.expanded = true;
    }
  }
  focus() {
    this.table.focus();
  }
}
