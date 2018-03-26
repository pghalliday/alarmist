import store from '../../../../../../src/cli/monitor/ui/redux/store';
import {
  reset,
  runStart,
} from '../../../../../../src/cli/monitor/ui/redux/actions';
import {
  MONITOR_LABEL,
  TYPE_JOB,
  TYPE_SERVICE,
  TYPE_METRIC,
  TYPE_TABLE,
} from '../../../../../../src/cli/monitor/ui/constants';
import {
  jobLabel,
} from '../../../../../../src/cli/monitor/ui/helpers';

let jobs;
let layoutLines;

const name = 'job name';
const id = 2;
const startTime = 100000;
const earlierId = 1;
const laterId = 3;

const otherName = 'other job name';
const otherId = 1;

const log = Buffer.alloc(0);
const lines = [''];

const table = {
  name,
  id,
  startTime,
  service: true,
  metric: true,
  table: true,
};

const metric = {
  name,
  id,
  startTime,
  service: true,
  metric: true,
};

const service = {
  name,
  id,
  startTime,
  service: true,
};

const job = {
  name,
  id,
  startTime,
};

const earlierJob = {
  name,
  id: earlierId,
  startTime,
};

const laterJob = {
  name,
  id: laterId,
  startTime,
};

const otherJob = {
  name: otherName,
  id: otherId,
  startTime,
};

const oneTable = {
  [name]: Object.assign({}, table, {
    type: TYPE_TABLE,
  }),
};

const oneMetric = {
  [name]: Object.assign({}, metric, {
    type: TYPE_METRIC,
    lines,
  }),
};

const oneService = {
  [name]: Object.assign({}, service, {
    type: TYPE_SERVICE,
    log,
  }),
};

const oneJob = {
  [name]: Object.assign({}, job, {
    type: TYPE_JOB,
    log,
  }),
};

const oneLaterJob = {
  [name]: Object.assign({}, laterJob, {
    type: TYPE_JOB,
    log,
  }),
};

const twoJobs = {
  [name]: Object.assign({}, job, {
    type: TYPE_JOB,
    log,
  }),
  [otherName]: Object.assign({}, otherJob, {
    type: TYPE_JOB,
    log,
  }),
};

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('redux', () => {
        describe('runStart', () => {
          describe('for a table', () => {
            before(() => {
              store.dispatch(reset());
              store.dispatch(runStart(table));
              const state = store.getState();
              jobs = state.jobs;
              layoutLines = state.layout.lines;
            });

            it('should add the table', () => {
              jobs.should.eql(oneTable);
            });

            it('should add to the layout lines', () => {
              layoutLines.should.eql([
                MONITOR_LABEL,
                jobLabel(name),
              ]);
            });
          });

          describe('for a metric', () => {
            before(() => {
              store.dispatch(reset());
              store.dispatch(runStart(metric));
              const state = store.getState();
              jobs = state.jobs;
              layoutLines = state.layout.lines;
            });

            it('should add the metric', () => {
              jobs.should.eql(oneMetric);
            });

            it('should add to the layout lines', () => {
              layoutLines.should.eql([
                MONITOR_LABEL,
                jobLabel(name),
              ]);
            });
          });

          describe('for a service', () => {
            before(() => {
              store.dispatch(reset());
              store.dispatch(runStart(service));
              const state = store.getState();
              jobs = state.jobs;
              layoutLines = state.layout.lines;
            });

            it('should add the service', () => {
              jobs.should.eql(oneService);
            });

            it('should add to the layout lines', () => {
              layoutLines.should.eql([
                MONITOR_LABEL,
                jobLabel(name),
              ]);
            });
          });

          describe('with an empty state', () => {
            before(() => {
              store.dispatch(reset());
              store.dispatch(runStart(job));
              const state = store.getState();
              jobs = state.jobs;
              layoutLines = state.layout.lines;
            });

            it('should add the first job', () => {
              jobs.should.eql(oneJob);
            });

            it('should add to the layout lines', () => {
              layoutLines.should.eql([
                MONITOR_LABEL,
                jobLabel(name),
              ]);
            });
          });

          describe('with an existing job', () => {
            describe('and a new job name', () => {
              before(() => {
                store.dispatch(reset());
                store.dispatch(runStart(job));
                store.dispatch(runStart(otherJob));
                const state = store.getState();
                jobs = state.jobs;
                layoutLines = state.layout.lines;
              });

              it('should add a second job', () => {
                jobs.should.eql(twoJobs);
              });

              it('should add another job to the layout lines', () => {
                layoutLines.should.eql([
                  MONITOR_LABEL,
                  jobLabel(name),
                  jobLabel(otherName),
                ]);
              });
            });

            describe('and an existing job name', () => {
              describe('and an earlier id', () => {
                before(() => {
                  store.dispatch(reset());
                  store.dispatch(runStart(job));
                  store.dispatch(runStart(earlierJob));
                  const state = store.getState();
                  jobs = state.jobs;
                  layoutLines = state.layout.lines;
                });

                it('should not change the jobs', () => {
                  jobs.should.eql(oneJob);
                });

                it('should not change the layout lines', () => {
                  layoutLines.should.eql([
                    MONITOR_LABEL,
                    jobLabel(name),
                  ]);
                });
              });

              describe('and a later id', () => {
                before(() => {
                  store.dispatch(reset());
                  store.dispatch(runStart(job));
                  store.dispatch(runStart(laterJob));
                  const state = store.getState();
                  jobs = state.jobs;
                  layoutLines = state.layout.lines;
                });

                it('should replace the job', () => {
                  jobs.should.eql(oneLaterJob);
                });

                it('should not change the layout lines', () => {
                  layoutLines.should.eql([
                    MONITOR_LABEL,
                    jobLabel(name),
                  ]);
                });
              });
            });
          });
        });
      });
    });
  });
});
