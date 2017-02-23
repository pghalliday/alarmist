import store from '../../../../../src/cli/ui/redux/store';
import {
  reset,
  update,
} from '../../../../../src/cli/ui/redux/actions';
import {
  MONITOR_LABEL,
} from '../../../../../src/cli/ui/constants';
import {
  jobLabel,
} from '../../../../../src/cli/ui/helpers';

let jobs;
let lines;

const name = 'job name';
const id = 2;
const earlierId = 1;
const laterId = 3;

const otherName = 'other job name';
const otherId = 1;

const job = {
  name,
  id,
};

const earlierJob = {
  name,
  id: earlierId,
};

const laterJob = {
  name,
  id: laterId,
};

const otherJob = {
  name: otherName,
  id: otherId,
};

const oneJob = {
  [name]: job,
};

const oneLaterJob = {
  [name]: laterJob,
};

const twoJobs = {
  [name]: job,
  [otherName]: otherJob,
};

describe('cli', () => {
  describe('ui', () => {
    describe('redux', () => {
      describe('update', () => {
        describe('with an empty state', () => {
          before(() => {
            store.dispatch(reset());
            store.dispatch(update(job));
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
              store.dispatch(update(job));
              store.dispatch(update(otherJob));
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
                store.dispatch(update(job));
                store.dispatch(update(earlierJob));
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
                store.dispatch(update(job));
                store.dispatch(update(laterJob));
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
