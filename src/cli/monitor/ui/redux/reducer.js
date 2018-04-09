import _ from 'lodash';
import appendBuffer from '../../../utils/append-buffer';
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';
import {
  reset,
  end,
  runStart,
  select,
  up,
  down,
  moveUp,
  moveDown,
  toggleExpanded,
  log,
  resize,
} from './actions';
import {
  MONITOR_LABEL,
} from '../constants';
import {
  jobLabel,
} from '../helpers';

const MAX_BUFFER_LENGTH = 100000;

const initialMonitor = {
  log: Buffer.alloc(0),
};

const monitor = handleActions({
  [reset]: () => initialMonitor,
  [end]: (monitor, {payload}) => {
    return Object.assign({}, monitor, {
      error: payload,
    });
  },
  [log]: (monitor, {payload}) => {
    return Object.assign({}, monitor, {
      log: appendBuffer(MAX_BUFFER_LENGTH, monitor.log, payload),
    });
  },
}, initialMonitor);

const initialLayout = {
  lines: [
    MONITOR_LABEL,
  ],
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
  [runStart]: (layout, {payload}) => {
    const entry = jobLabel(payload.name);
    const lines = layout.lines;
    const index = _.indexOf(lines, entry);
    if (index === -1) {
      return Object.assign({}, layout, {
        lines: lines.concat([entry]),
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
  const initialJobs = {};
  let jobReducers = {};
  let jobsReducer = combineReducers(jobReducers);
  const jobsRootReducer = handleActions({
    [reset]: () => {
      jobReducers = {};
      jobsReducer = combineReducers(jobReducers);
      return initialJobs;
    },
    [runStart]: (jobs, {payload}) => {
      const name = payload.name;
      if (!jobReducers[name]) {
        const type = types[payload.type];
        if (type) {
          jobReducers[name] = type.createReducer(name);
          jobsReducer = combineReducers(jobReducers);
        } else {
          // TODO: log an unknown type error
        }
      }
      return jobs;
    },
  }, initialJobs);
  const jobs = (state, action) => {
    const newState = jobsRootReducer(state, action);
    return jobsReducer(newState, action);
  };

  return combineReducers({
    monitor,
    jobs,
    layout,
  });
}
