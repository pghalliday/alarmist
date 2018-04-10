import _ from 'lodash';
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

const initialLayout = {
  lines: [],
  selected: 0,
  expanded: false,
  width: 0,
  height: 0,
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

export function createReducer(types) {
  const initialEntries = {};
  let entryReducers = {};
  let entriesReducer = combineReducers(entryReducers);
  const entriesRootReducer = handleActions({
    [reset]: () => {
      entryReducers = {};
      entriesReducer = combineReducers(entryReducers);
      return initialEntries;
    },
    [start]: (entries, {payload}) => {
      const name = payload.name;
      if (!entryReducers[name]) {
        const type = types[payload.type];
        if (type) {
          entryReducers[name] = type.createReducer(name);
          entriesReducer = combineReducers(entryReducers);
        } else {
          // TODO: log an unknown type error
        }
      }
      return entries;
    },
  }, initialEntries);
  const entries = (state, action) => {
    const newState = entriesRootReducer(state, action);
    return entriesReducer(newState, action);
  };

  return combineReducers({
    entries,
    layout,
  });
}
