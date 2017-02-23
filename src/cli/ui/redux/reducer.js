import _ from 'lodash';
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';
import {
  reset,
  exit,
  update,
  up,
  down,
} from './actions';
import {
  MONITOR_LABEL,
} from '../constants';
import {
  jobLabel,
} from '../helpers';

const initialMonitor = {};

const monitor = handleActions({
  [reset]: () => initialMonitor,
  [exit]: (monitor, {payload}) => ({exitCode: payload}),
}, initialMonitor);

const initialJobs = {};

const jobs = handleActions({
  [reset]: () => initialJobs,
  [update]: (jobs, {payload}) => {
    const name = payload.name;
    const existing = jobs[name];
    if (!_.isUndefined(existing) && existing.id > payload.id) {
      return jobs;
    }
    return Object.assign({}, jobs, {
      [name]: payload,
    });
  },
}, initialJobs);

const initialLayout = {
  lines: [
    MONITOR_LABEL,
  ],
  selected: 0,
};

const layout = handleActions({
  [reset]: () => initialLayout,
  [update]: (layout, {payload}) => {
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
}, initialLayout);

export default combineReducers({
  monitor,
  jobs,
  layout,
});
