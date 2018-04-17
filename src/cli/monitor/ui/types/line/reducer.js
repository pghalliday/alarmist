import {
  forOwn,
  without,
} from 'lodash';
import {
  createActions,
  handleActions,
} from 'redux-actions';
import {
  createSelector,
} from 'reselect';
import {
  gt,
  eq,
  check,
} from '../common/reducer';

export const {
  lineStart,
  linePoint,
  lineEnd,
} = createActions(
  'LINE_START',
  'LINE_POINT',
  'LINE_END',
);

function headerText(name, message) {
  return `${name}: ${message}`;
}

function appendValue(values, value, minLength) {
  if (values.length === 0) {
    return Array(minLength || 1).fill(value);
  }
  const lastValue = values[values.length - 1];
  const shortage = minLength - (values.length + 1);
  const newValues = Array(shortage).fill(lastValue);
  newValues.push(value);
  return values.concat(newValues);
}

function updateErrorSeries(errorSeries, series, error) {
  const newErrorSeries = without(errorSeries, series);
  if (error) {
    newErrorSeries.unshift(series);
  }
  return newErrorSeries;
}

function extendX(x, length, newLength) {
  if (newLength > length) {
    const extra = [];
    for (let i = length; i < newLength; i++) {
      extra.push(i);
    }
    return x.concat(extra);
  }
  return x;
}

function extendValues(values, length) {
  const shortage = length - values.length;
  if (shortage) {
    const lastValue = values[values.length - 1];
    return values.concat(Array(shortage).fill(lastValue));
  }
  return values;
}

export default function createReducer(name, type) {
  const nameSelector = (state) => state.name;
  const runningSelector = (state) => state.running;
  const errorSelector = (state) => state.error;
  const errorSeriesSelector = (state) => state.errorSeries;
  const lastSeriesSelector = (state) => state.lastSeries;
  const seriesSelector = (state) => state.series;
  const lengthSelector = (state) => state.length;
  const xSelector = (state) => state.x;
  const seriesErrorSelector = createSelector(
    errorSeriesSelector,
    (errorSeries) => errorSeries[0],
  );
  const headerSelector = createSelector(
    nameSelector,
    runningSelector,
    errorSelector,
    seriesErrorSelector,
    lastSeriesSelector,
    seriesSelector,
    (name, running, error, seriesError, lastSeries, series) => {
      if (running) {
        if (seriesError) {
          const _series = series[seriesError];
          const _error = _series.error;
          const _value = _series.values[_series.values.length - 1];
          return {
            text: headerText(name, `${seriesError}: ${_value}: ${_error}`),
            bgcolor: 'red',
            fgcolor: 'black',
          };
        } else {
          if (lastSeries) {
            const _series = series[lastSeries];
            const _value = _series.values[_series.values.length - 1];
            return {
              text: headerText(name, `${lastSeries}: ${_value}`),
              bgcolor: 'green',
              fgcolor: 'black',
            };
          } else {
            return {
              text: headerText(name, 'ready'),
              bgcolor: 'green',
              fgcolor: 'black',
            };
          }
        }
      }
      if (error) {
        return {
          text: headerText(name, `exited: ${error}`),
          bgcolor: 'red',
          fgcolor: 'black',
        };
      }
      return {
        text: headerText(name, 'exited'),
        bgcolor: 'red',
        fgcolor: 'black',
      };
    },
  );
  const dataSelector = createSelector(
    seriesSelector,
    lengthSelector,
    xSelector,
    (series, length, x) => {
      const data = [];
      forOwn(series, (series, title) => {
        data.push({
          title,
          style: {
            line: series.error ? 'red' : 'green',
          },
          x,
          y: extendValues(series.values, length),
        });
      });
      return data;
    },
  );

  const INITIAL_STATE = {
    name,
    type,
    id: 0,
    running: false,
    series: {},
    length: 0,
    errorSeries: [],
    lastSeries: undefined,
    error: undefined,
    x: [],
    selectors: {
      header: headerSelector,
      data: dataSelector,
    },
  };

  return handleActions({
    // eslint-disable-next-line max-len
    [lineStart]: (state, {payload}) => check(gt, state, payload, () => Object.assign({}, state, {
      id: payload.id,
      running: true,
      series: {},
      errorSeries: [],
      error: undefined,
    })),
    // eslint-disable-next-line max-len
    [linePoint]: (state, {payload}) => check(eq, state, payload, () => {
      const series = state.series[payload.series];
      const values = appendValue(
        series ? series.values : [],
        payload.value,
        state.length
      );
      const errorSeries = updateErrorSeries(
        state.errorSeries,
        payload.series,
        payload.error
      );
      const length = Math.max(state.length, values.length);
      const x = extendX(state.x, state.length, length);
      return Object.assign({}, state, {
        series: Object.assign({}, state.series, {
          [payload.series]: {
            error: payload.error,
            values,
          },
        }),
        lastSeries: payload.series,
        errorSeries,
        length,
        x,
      });
    }),
    // eslint-disable-next-line max-len
    [lineEnd]: (state, {payload}) => check(eq, state, payload, () => Object.assign({}, state, {
    }, {
      running: false,
      error: payload.error,
    })),
  }, INITIAL_STATE);
}
