import {
  store,
  actions,
} from '../../../src/cli/state';

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

describe('cli', () => {
  describe('state', () => {
    describe('actions', () => {
      describe('updateJob', () => {
        describe('with an empty state', () => {
          before(() => {
            store.dispatch(actions.reset());
            store.dispatch(actions.updateJob(job));
            jobs = store.getState();
          });

          it('should add the first job', () => {
            jobs.should.eql([
              job,
            ]);
          });
        });

        describe('with an existing job', () => {
          describe('and a new job name', () => {
            before(() => {
              store.dispatch(actions.reset());
              store.dispatch(actions.updateJob(job));
              store.dispatch(actions.updateJob(otherJob));
              jobs = store.getState();
            });

            it('should add a second job', () => {
              jobs.should.eql([
                job,
                otherJob,
              ]);
            });
          });

          describe('and an existing job name', () => {
            describe('and an earlier id', () => {
              before(() => {
                store.dispatch(actions.reset());
                store.dispatch(actions.updateJob(job));
                store.dispatch(actions.updateJob(earlierJob));
                jobs = store.getState();
              });

              it('should not change anything', () => {
                jobs.should.eql([
                  job,
                ]);
              });
            });

            describe('and a later id', () => {
              before(() => {
                store.dispatch(actions.reset());
                store.dispatch(actions.updateJob(job));
                store.dispatch(actions.updateJob(laterJob));
                jobs = store.getState();
              });

              it('should replace the job', () => {
                jobs.should.eql([
                  laterJob,
                ]);
              });
            });
          });
        });
      });
    });
  });
});
