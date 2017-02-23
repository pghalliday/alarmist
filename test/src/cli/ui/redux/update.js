import store from '../../../../../src/cli/ui/redux/store';
import {
  reset,
  update,
} from '../../../../../src/cli/ui/redux/actions';

let jobs;

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
            jobs = store.getState().jobs;
          });

          it('should add the first job', () => {
            jobs.should.eql(oneJob);
          });
        });

        describe('with an existing job', () => {
          describe('and a new job name', () => {
            before(() => {
              store.dispatch(reset());
              store.dispatch(update(job));
              store.dispatch(update(otherJob));
              jobs = store.getState().jobs;
            });

            it('should add a second job', () => {
              jobs.should.eql(twoJobs);
            });
          });

          describe('and an existing job name', () => {
            describe('and an earlier id', () => {
              before(() => {
                store.dispatch(reset());
                store.dispatch(update(job));
                store.dispatch(update(earlierJob));
                jobs = store.getState().jobs;
              });

              it('should not change anything', () => {
                jobs.should.eql(oneJob);
              });
            });

            describe('and a later id', () => {
              before(() => {
                store.dispatch(reset());
                store.dispatch(update(job));
                store.dispatch(update(laterJob));
                jobs = store.getState().jobs;
              });

              it('should replace the job', () => {
                jobs.should.eql(oneLaterJob);
              });
            });
          });
        });
      });
    });
  });
});
