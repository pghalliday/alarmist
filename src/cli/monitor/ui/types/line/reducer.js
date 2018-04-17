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
  lineAdvance,
  lineValue,
  lineEnd,
} = createActions(
  'LINE_START',
  'LINE_ADVANCE',
  'LINE_VALUE',
  'LINE_END',
);

function headerText(name, message) {
  return `${name}: ${message}`;
}

function appendValue(values, value, length) {
  const oldLength = values.length;
  if (oldLength === 0) {
    return Array(length).fill(value);
  }
  if (oldLength === length) {
    const newValues = values.slice(0, -1);
    newValues.push(value);
    return newValues;
  }
  const newValues = values.slice();
  const lengthDiff = length - oldLength;
  if (lengthDiff > 1) {
    const lastValue = values[oldLength - 1];
    const increment = (value - lastValue) / lengthDiff;
    for (let i = 1; i < lengthDiff; i++) {
      newValues.push(lastValue + (increment * i));
    }
    newValues.push(value);
  }
  return newValues;
}

function updateErrorSeries(errorSeries, series, error) {
  const newErrorSeries = without(errorSeries, series);
  if (error) {
    newErrorSeries.unshift(series);
  }
  return newErrorSeries;
}

export default function createReducer(name, type) {
  const nameSelector = (state) => state.name;
  const runningSelector = (state) => state.running;
  const errorSelector = (state) => state.error;
  const errorSeriesSelector = (state) => state.errorSeries;
  const lastSeriesSelector = (state) => state.lastSeries;
  const seriesSelector = (state) => state.series;
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
    xSelector,
    (series, length, x) => {
      const data = [];
      forOwn(series, (series, title) => {
        data.push({
          title,
          style: {
            line: series.error ? 'red' : 'green',
          },
          x: x.slice(0, series.values.length),
          y: series.values,
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
    [lineAdvance]: (state, {payload}) => check(eq, state, payload, () => Object.assign({}, state, {
      x: state.x.concat([state.x.length]),
    })),
    // eslint-disable-next-line max-len
    [lineValue]: (state, {payload}) => check(eq, state, payload, () => {
      const series = state.series[payload.series];
      const values = appendValue(
        series ? series.values : [],
        payload.value,
        state.x.length,
      );
      const errorSeries = updateErrorSeries(
        state.errorSeries,
        payload.series,
        payload.error
      );
      return Object.assign({}, state, {
        series: Object.assign({}, state.series, {
          [payload.series]: {
            error: payload.error,
            values,
          },
        }),
        lastSeries: payload.series,
        errorSeries,
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
