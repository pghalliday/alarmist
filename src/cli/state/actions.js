import {createActions} from 'redux-actions';

module.exports = createActions({
  RESET: () => undefined,
  START_JOB: (job) => job,
  COMPLETE_JOB: (job) => job,
});
