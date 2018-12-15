import _ from 'lodash';
import blessed from 'blessed';
import asciichart from 'asciichart';
import {
  CHART_PROPERTIES,
  CHART_PADDING,
} from './constants';
import Entry from './entry';

const STATUS_COLORS = ['green', 'yellow', 'red'];

// check if there is a non zero range of values
function rangeIsGood(values) {
  let min;
  let max;
  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    min = Math.min(value, min || value);
    max = Math.max(value, max || value);
    if (min < max) {
      return true;
    }
  }
  return false;
}

function parseValue(line) {
  const fields = line.split(',');
  return parseFloat(fields[0]);
}

function parseEntry(line) {
  const fields = line.split(',');
  return {
    value: parseFloat(fields.shift()),
    status: parseInt(fields.shift() || 0),
    message: fields.join(','),
  };
}

function latestEntry(lines) {
  const latestLine = lines[lines.length - 2];
  if (latestLine) {
    return parseEntry(latestLine);
  }
}

function jobContent(status, entry) {
  let message = 'ok';
  if (_.isUndefined(status.endTime)) {
    if (entry) {
      if (entry.message) {
        message = `${entry.value} - ${entry.message}`;
      } else {
        message = entry.value;
      }
    }
  } else {
    message = _.isUndefined(status.error) ? 'ended' : status.error;
  }
  return ` ${status.name}: ${message}`;
}

function jobBg(status, entry) {
  if (_.isUndefined(status.endTime)) {
    if (entry) {
      if (entry.status) {
        return STATUS_COLORS[entry.status] || 'red';
      } else {
        return 'green';
      }
    } else {
      return 'green';
    }
  } else {
    return 'red';
  }
}

export default class Metric extends Entry {
  constructor() {
    super();
    this.expanded = false;
    this.chart = blessed.box(_.cloneDeep(CHART_PROPERTIES));
    this.chart.hide();
    this.clear();
  }
  _setContentParent(container) {
    container.append(this.chart);
  }
  _update(status) {
    const subsetLength = this.chart.width - CHART_PADDING.length - 2;
    // istanbul ignore else
    if (subsetLength > 1) {
      // the last line should always be incomplete so
      // take the last subsetLength complete lines and parse the values
      const subset = status.lines.slice(-subsetLength - 1, -1)
          .map(parseValue);
      // asciichart will fall over if the range of values has zero size
      if (rangeIsGood(subset)) {
        this.chart.setContent(asciichart.plot(subset, {
          padding: CHART_PADDING,
          height: this.chart.height - 1,
        }));
      } else {
        this.clear();
      }
    }
    const entry = latestEntry(status.lines);
    this.setHeader(
        jobContent(status, entry),
        jobBg(status, entry),
    );
  }
  clear() {
    this.chart.setContent('');
  }
  setContentHeight(height) {
    this.chart.height = height;
  }
  _setContentTop(top) {
    this.chart.top = top;
  }
  // istanbul ignore next
  collapse() {
    if (this.expanded) {
      this.expanded = false;
      this.chart.hide();
    }
  }
  // istanbul ignore next
  expand() {
    if (!this.expanded) {
      this.chart.show();
      this.expanded = true;
    }
  }
  focus() {
    this.chart.focus();
  }
}
