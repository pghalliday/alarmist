import store from '../../../../../../src/cli/monitor/ui/redux/store';
import {
  reset,
  runStart,
} from '../../../../../../src/cli/monitor/ui/redux/actions';
import {
  MONITOR_LABEL,
} from '../../../../../../src/cli/monitor/ui/constants';
import {
  jobLabel,
} from '../../../../../../src/cli/monitor/ui/helpers';

let jobs;
let lines;

const name = 'job name';
const id = 2;
const startTime = 100000;
const earlierId = 1;
const laterId = 3;

const otherName = 'other job name';
const otherId = 1;

const log = Buffer.alloc(0);

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

const oneJob = {
  [name]: Object.assign({}, job, {
    log,
  }),
};

const oneLaterJob = {
  [name]: Object.assign({}, laterJob, {
    log,
  }),
};

const twoJobs = {
  [name]: Object.assign({}, job, {
    log,
  }),
  [otherName]: Object.assign({}, otherJob, {
    log,
  }),
};

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('redux', () => {
        describe('runStart', () => {
          describe('with an empty state', () => {
            before(() => {
              store.dispatch(reset());
              store.dispatch(runStart(job));
              const state = store.getState();
              jobs = state.jobs;
              lines = state.layout.lines;
            });

            it('should add the first job', () => {
              jobs.should.eql(oneJob);
            });

            it('should add to the layout lines', () => {
              lines.should.eql([
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
                lines = state.layout.lines;
              });

              it('should add a second job', () => {
                jobs.should.eql(twoJobs);
              });

              it('should add another job to the layout lines', () => {
                lines.should.eql([
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
                  lines = state.layout.lines;
                });

                it('should not change the jobs', () => {
                  jobs.should.eql(oneJob);
                });

                it('should not change the layout lines', () => {
                  lines.should.eql([
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
                  lines = state.layout.lines;
                });

                it('should replace the job', () => {
                  jobs.should.eql(oneLaterJob);
                });

                it('should not change the layout lines', () => {
                  lines.should.eql([
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
