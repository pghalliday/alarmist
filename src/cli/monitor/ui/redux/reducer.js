import _ from 'lodash';
import appendBuffer from '../../../utils/append-buffer';
import appendLines from '../../../utils/append-lines';
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';
import {
  reset,
  end,
  runStart,
  runEnd,
  select,
  up,
  down,
  moveUp,
  moveDown,
  toggleExpanded,
  log,
  runLog,
  resize,
} from './actions';
import {
  MONITOR_LABEL,
} from '../constants';
import {
  jobLabel,
} from '../helpers';

const MAX_BUFFER_LENGTH = 100000;
const MAX_LINES_LENGTH = 10000;
const MAX_LINE_LENGTH = 1000;

const initialMonitor = {
  log: Buffer.alloc(0),
  // always start with 1 incomplete line
  lines: [''],
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
      lines: appendLines(
          MAX_LINES_LENGTH,
          MAX_LINE_LENGTH,
          monitor.lines,
          payload
      ),
    });
  },
}, initialMonitor);

const initialJobs = {};

const jobs = handleActions({
  [reset]: () => initialJobs,
  [runStart]: (jobs, {payload}) => {
    const name = payload.name;
    const existing = jobs[name];
    if (!_.isUndefined(existing) && existing.id > payload.id) {
      return jobs;
    }
    return Object.assign({}, jobs, {
      [name]: Object.assign({
        log: Buffer.alloc(0),
        // always start with 1 incomplete line
        lines: [''],
      }, payload),
    });
  },
  [runLog]: (jobs, {payload}) => {
    const name = payload.name;
    const job = jobs[name];
    if (!_.isUndefined(job) && payload.id === job.id) {
      return Object.assign({}, jobs, {
        [name]: Object.assign({}, job, {
          log: appendBuffer(MAX_BUFFER_LENGTH, job.log, payload.data),
          lines: appendLines(
              MAX_LINES_LENGTH,
              MAX_LINE_LENGTH,
              job.lines,
              payload.data
          ),
        }),
      });
    }
    return jobs;
  },
  [runEnd]: (jobs, {payload}) => {
    const name = payload.name;
    const job = jobs[name];
    if (!_.isUndefined(job) && payload.id === job.id) {
      return Object.assign({}, jobs, {
        [name]: Object.assign({}, job, payload),
      });
    }
    return jobs;
  },
}, initialJobs);

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
    return Object.assign({}, layout, {
      selected: index,
      expanded: true,
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

export default combineReducers({
  monitor,
  jobs,
  layout,
});
