"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _appendBuffer = _interopRequireDefault(require("../../../utils/append-buffer"));

var _appendLines = _interopRequireDefault(require("../../../utils/append-lines"));

var _redux = require("redux");

var _reduxActions = require("redux-actions");

var _actions = require("./actions");

var _constants = require("../constants");

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MAX_BUFFER_LENGTH = 100000;
const MAX_LINES_LENGTH = 10000;
const MAX_LINE_LENGTH = 1000;
const initialMonitor = {
  log: Buffer.alloc(0),
  // always start with 1 incomplete line
  lines: ['']
};
const monitor = (0, _reduxActions.handleActions)({
  [_actions.reset]: () => initialMonitor,
  [_actions.end]: (monitor, {
    payload
  }) => {
    return Object.assign({}, monitor, {
      error: payload
    });
  },
  [_actions.log]: (monitor, {
    payload
  }) => {
    return Object.assign({}, monitor, {
      log: (0, _appendBuffer.default)(MAX_BUFFER_LENGTH, monitor.log, payload),
      lines: (0, _appendLines.default)(MAX_LINES_LENGTH, MAX_LINE_LENGTH, monitor.lines, payload)
    });
  }
}, initialMonitor);
const initialJobs = {};
const jobs = (0, _reduxActions.handleActions)({
  [_actions.reset]: () => initialJobs,
  [_actions.runStart]: (jobs, {
    payload
  }) => {
    const name = payload.name;
    const existing = jobs[name];

    if (!_lodash.default.isUndefined(existing) && existing.id > payload.id) {
      return jobs;
    }

    return Object.assign({}, jobs, {
      [name]: Object.assign({
        log: Buffer.alloc(0),
        // always start with 1 incomplete line
        lines: ['']
      }, payload)
    });
  },
  [_actions.runLog]: (jobs, {
    payload
  }) => {
    const name = payload.name;
    const job = jobs[name];

    if (!_lodash.default.isUndefined(job) && payload.id === job.id) {
      return Object.assign({}, jobs, {
        [name]: Object.assign({}, job, {
          log: (0, _appendBuffer.default)(MAX_BUFFER_LENGTH, job.log, payload.data),
          lines: (0, _appendLines.default)(MAX_LINES_LENGTH, MAX_LINE_LENGTH, job.lines, payload.data)
        })
      });
    }

    return jobs;
  },
  [_actions.runEnd]: (jobs, {
    payload
  }) => {
    const name = payload.name;
    const job = jobs[name];

    if (!_lodash.default.isUndefined(job) && payload.id === job.id) {
      return Object.assign({}, jobs, {
        [name]: Object.assign({}, job, payload)
      });
    }

    return jobs;
  }
}, initialJobs);
const initialLayout = {
  lines: [_constants.MONITOR_LABEL],
  selected: 0,
  expanded: false,
  width: 0,
  height: 0
};
const layout = (0, _reduxActions.handleActions)({
  [_actions.reset]: () => initialLayout,
  [_actions.resize]: (layout, {
    payload
  }) => {
    return Object.assign({}, layout, {
      width: payload.width,
      height: payload.height
    });
  },
  [_actions.runStart]: (layout, {
    payload
  }) => {
    const entry = (0, _helpers.jobLabel)(payload.name);
    const lines = layout.lines;

    const index = _lodash.default.indexOf(lines, entry);

    if (index === -1) {
      return Object.assign({}, layout, {
        lines: lines.concat([entry])
      });
    }

    return layout;
  },
  [_actions.select]: (layout, {
    payload
  }) => {
    const index = _lodash.default.indexOf(layout.lines, payload);

    return Object.assign({}, layout, {
      selected: index,
      expanded: true
    });
  },
  [_actions.down]: layout => {
    const selected = layout.selected;
    const maxSelected = layout.lines.length - 1;

    if (selected < maxSelected) {
      return Object.assign({}, layout, {
        selected: selected + 1
      });
    }

    return layout;
  },
  [_actions.up]: layout => {
    const selected = layout.selected;

    if (selected > 0) {
      return Object.assign({}, layout, {
        selected: selected - 1
      });
    }

    return layout;
  },
  [_actions.moveDown]: layout => {
    const selected = layout.selected;
    const lines = layout.lines;
    const maxSelected = layout.lines.length - 1;

    if (selected < maxSelected) {
      return Object.assign({}, layout, {
        selected: selected + 1,
        lines: lines.slice(0, selected).concat(lines[selected + 1], lines[selected], lines.slice(selected + 2))
      });
    }

    return layout;
  },
  [_actions.moveUp]: layout => {
    const selected = layout.selected;
    const lines = layout.lines;

    if (selected > 0) {
      return Object.assign({}, layout, {
        selected: selected - 1,
        lines: lines.slice(0, selected - 1).concat(lines[selected], lines[selected - 1], lines.slice(selected + 1))
      });
    }

    return layout;
  },
  [_actions.toggleExpanded]: layout => {
    return Object.assign({}, layout, {
      expanded: !layout.expanded
    });
  }
}, initialLayout);

var _default = (0, _redux.combineReducers)({
  monitor,
  jobs,
  layout
});

exports.default = _default;