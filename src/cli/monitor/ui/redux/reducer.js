import _ from 'lodash';
import logger from '../../logger';
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';
import {
  reset,
  start,
  select,
  up,
  down,
  moveUp,
  moveDown,
  toggleExpanded,
  resize,
} from './actions';

export function createReducer(types, screen) {
  const initialLayout = {
    lines: [],
    selected: 0,
    expanded: false,
    width: screen.width,
    height: screen.height,
  };

  const layout = handleActions({
    [reset]: () => initialLayout,
    [resize]: (layout, {payload}) => {
      return Object.assign({}, layout, {
        width: payload.width,
        height: payload.height,
      });
    },
    [start]: (layout, {payload}) => {
      const name = payload.name;
      const lines = layout.lines;
      const index = _.indexOf(lines, name);
      if (index === -1) {
        return Object.assign({}, layout, {
          lines: lines.concat([name]),
        });
      }
      return layout;
    },
    [select]: (layout, {payload}) => {
      const index = _.indexOf(layout.lines, payload);
      const changed = index !== layout.selected;
      return Object.assign({}, layout, {
        selected: index,
        expanded: changed || !layout.expanded,
      });
    },
    [down]: (layout) => {
      const selected = layout.selected;
      const maxSelected = layout.lines.length - 1;
      if (selected < maxSelected) {
        return Object.assign({}, layout, {
          selected: selected + 1,
        });
      }
      return layout;
    },
    [up]: (layout) => {
      const selected = layout.selected;
      if (selected > 0) {
        return Object.assign({}, layout, {
          selected: selected - 1,
        });
      }
      return layout;
    },
    [moveDown]: (layout) => {
      const selected = layout.selected;
      const lines = layout.lines;
      const maxSelected = layout.lines.length - 1;
      if (selected < maxSelected) {
        return Object.assign({}, layout, {
          selected: selected + 1,
          lines: lines.slice(0, selected).concat(
            lines[selected + 1],
            lines[selected],
            lines.slice(selected + 2),
          ),
        });
      }
      return layout;
    },
    [moveUp]: (layout) => {
      const selected = layout.selected;
      const lines = layout.lines;
      if (selected > 0) {
        return Object.assign({}, layout, {
          selected: selected - 1,
          lines: lines.slice(0, selected - 1).concat(
            lines[selected],
            lines[selected - 1],
            lines.slice(selected + 1),
          ),
        });
      }
      return layout;
    },
    [toggleExpanded]: (layout) => {
      return Object.assign({}, layout, {
        expanded: !layout.expanded,
      });
    },
  }, initialLayout);

  const initialEntries = {};
  let entryReducers = {};
  let entriesReducer = null;
  const entriesRootReducer = handleActions({
    [reset]: () => {
      entryReducers = {};
      entriesReducer = null;
      return initialEntries;
    },
    [start]: (entries, {payload}) => {
      const name = payload.name;
      if (!entryReducers[name]) {
        const type = types[payload.type];
        if (type) {
          entryReducers[name] = type.createReducer(name, payload.type);
          entriesReducer = combineReducers(entryReducers);
        } else {
          logger.log(`No reducer available for this type of entry: ${type}`);
        }
      }
      return entries;
    },
  }, initialEntries);
  const entries = (state, action) => {
    const newState = entriesRootReducer(state, action);
    if (entriesReducer) {
      return entriesReducer(newState, action);
    }
    return newState;
  };

  return combineReducers({
    entries,
    layout,
  });
}
