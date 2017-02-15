import {
  store,
  actions,
} from '../../../src/cli/state';

let jobs;

const name = 'job name';
const id = 'job id';
const earlierStartTime = 1;
const startTime = 2;
const laterStartTime = 3;
const endTime = 5;
const exitCode = 0;
const stdout = 'job stdout';
const stderr = 'job stderr';
const all = 'job all';

const otherName = 'other job name';
const otherId = 'other job id';

const job = {
  name,
  id,
  startTime,
  endTime,
  exitCode,
  stdout,
  stderr,
  all,
};

const earlierJob = {
  name,
  id: otherId,
  startTime: earlierStartTime,
  endTime,
  exitCode,
  stdout,
  stderr,
  all,
};

const laterJob = {
  name,
  id: otherId,
  startTime: laterStartTime,
  endTime,
  exitCode,
  stdout,
  stderr,
  all,
};

const otherJob = {
  name: otherName,
  id: otherId,
  startTime,
  endTime,
  exitCode,
  stdout,
  stderr,
  all,
};

const firstJob = {
  name,
  id,
  startTime,
  endTime,
  exitCode,
  stdout,
  stderr,
  all,
  selected: true,
  expanded: false,
};

const laterFirstJob = {
  name,
  id: otherId,
  startTime: laterStartTime,
  endTime,
  exitCode,
  stdout,
  stderr,
  all,
  selected: true,
  expanded: false,
};

const secondJob = {
  name: otherName,
  id: otherId,
  startTime,
  endTime,
  exitCode,
  stdout,
  stderr,
  all,
  selected: false,
  expanded: false,
};

describe('cli', () => {
  describe('state', () => {
    describe('actions', () => {
      describe('completeJob', () => {
        describe('with an empty state', () => {
          before(() => {
            store.dispatch(actions.reset());
            store.dispatch(actions.completeJob(job));
            jobs = store.getState();
          });

          it('should add the first job', () => {
            jobs.should.eql([firstJob]);
          });
        });

        describe('with an existing job', () => {
          describe('and a new job name', () => {
            before(() => {
              store.dispatch(actions.reset());
              store.dispatch(actions.completeJob(job));
              store.dispatch(actions.completeJob(otherJob));
              jobs = store.getState();
            });

            it('should add a second job', () => {
              jobs.should.eql([
                firstJob,
                secondJob,
              ]);
            });
          });

          describe('and an existing job name', () => {
            describe('and an earlier start time', () => {
              before(() => {
                store.dispatch(actions.reset());
                store.dispatch(actions.completeJob(job));
                store.dispatch(actions.completeJob(earlierJob));
                jobs = store.getState();
              });

              it('should not change anything', () => {
                jobs.should.eql([
                  firstJob,
                ]);
              });
            });

            describe('and a later start time', () => {
              before(() => {
                store.dispatch(actions.reset());
                store.dispatch(actions.completeJob(job));
                store.dispatch(actions.completeJob(laterJob));
                jobs = store.getState();
              });

              it('should replace the job', () => {
                jobs.should.eql([
                  laterFirstJob,
                ]);
              });
            });
          });
        });
      });
    });
  });
});
