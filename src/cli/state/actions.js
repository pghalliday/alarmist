import {createActions} from 'redux-actions';

module.exports = createActions({
  RESET: () => undefined,
  UPDATE_JOB: (job) => job,
});
