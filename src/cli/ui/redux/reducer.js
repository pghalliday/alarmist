import _ from 'lodash';
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';
import {
  reset,
  exit,
  start,
  end,
  up,
  down,
  toggleExpanded,
  monitorLog,
  jobLog,
} from './actions';
import {
  MONITOR_LABEL,
} from '../constants';
import {
  jobLabel,
} from '../helpers';

const initialMonitor = {
  log: Buffer.alloc(0),
};

const monitor = handleActions({
  [reset]: () => initialMonitor,
  [exit]: (monitor, {payload}) => {
    return Object.assign({}, monitor, {
      exitCode: payload,
    });
  },
  [monitorLog]: (monitor, {payload}) => {
    return Object.assign({}, monitor, {
      log: Buffer.concat([monitor.log, payload]),
    });
  },
}, initialMonitor);

const initialJobs = {};

const jobs = handleActions({
  [reset]: () => initialJobs,
  [start]: (jobs, {payload}) => {
    const name = payload.name;
    const existing = jobs[name];
    if (!_.isUndefined(existing) && existing.id > payload.id) {
      return jobs;
    }
    return Object.assign({}, jobs, {
      [name]: Object.assign({
        log: Buffer.alloc(0),
      }, payload),
    });
  },
  [jobLog]: (jobs, {payload}) => {
    const name = payload.name;
    const job = jobs[name];
    if (!_.isUndefined(job) && payload.id === job.id) {
      return Object.assign({}, jobs, {
        [name]: Object.assign({}, job, {
          log: Buffer.concat([job.log, payload.data]),
        }),
      });
    }
    return jobs;
  },
  [end]: (jobs, {payload}) => {
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
};

const layout = handleActions({
  [reset]: () => initialLayout,
  [start]: (layout, {payload}) => {
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
