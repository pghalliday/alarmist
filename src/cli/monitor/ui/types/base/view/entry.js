import blessed from 'blessed';
import {
  HEADER_HEIGHT,
} from './constants';
import EventEmitter from 'events';
import {createSelector} from 'reselect';

export default class Entry extends EventEmitter {
  constructor() {
    super();
    const topSelector = (rect) => rect.top;
    const leftSelector = (rect) => rect.left;
    const widthSelector = (rect) => rect.width;
    const heightSelector = (rect) => rect.height;
    this._layoutSelector = createSelector(
      topSelector,
      leftSelector,
      widthSelector,
      heightSelector,
      (top, left, width, height) => ({top, left, width, height}),
    );
    this._header = blessed.text({
      height: HEADER_HEIGHT,
      autoFocus: false,
    });
    this._header.on('click', () => {
      this.emit('select');
    });
  }
  setParent(container) {
    container.append(this._header);
  }
  update(state) {
    const headerState = state.selectors.header(state);
    if (this._headerState !== headerState) {
      this._headerState = headerState;
      this._header.setContent(' ' + headerState.text);
      this._header.style.bg = headerState.bgcolor;
      this._header.style.fg = headerState.fgcolor;
    }
  }
  layout(_rect) {
    const rect = this._layoutSelector(_rect);
    if (this._rect !== rect) {
      this._rect = rect;
      this._header.top = rect.top;
      this._header.left = rect.left;
      this._header.width = rect.width;
      return true;
    }
    return false;
  }
  collapse() {
  }
  expand() {
  }
  focus() {
  }
}
