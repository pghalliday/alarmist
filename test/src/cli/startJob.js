import {
  store,
  actions,
} from '../../../src/cli/state';

let jobs;

const name = 'job name';
const id = 'job id';
const startTime = 2;
const earlierStartTime = 1;
const laterStartTime = 3;

const otherName = 'other job name';
const otherId = 'other job id';
const otherStartTime = 4;

const job = {
  name,
  id,
  startTime,
};

const earlierJob = {
  name,
  id: otherId,
  startTime: earlierStartTime,
};

const laterJob = {
  name,
  id: otherId,
  startTime: laterStartTime,
};

const otherJob = {
  name: otherName,
  id: otherId,
  startTime: otherStartTime,
};

const firstJob = {
  name,
  id,
  startTime,
  selected: true,
  expanded: false,
};

const laterFirstJob = {
  name,
  id: otherId,
  startTime: laterStartTime,
  selected: true,
  expanded: false,
};

const secondJob = {
  name: otherName,
  id: otherId,
  startTime: otherStartTime,
  selected: false,
  expanded: false,
};

describe('cli', () => {
  describe('state', () => {
    describe('actions', () => {
      describe('startJob', () => {
        describe('with an empty state', () => {
          before(() => {
            store.dispatch(actions.reset());
            store.dispatch(actions.startJob(job));
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
              store.dispatch(actions.startJob(job));
              store.dispatch(actions.startJob(otherJob));
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
                store.dispatch(actions.startJob(job));
                store.dispatch(actions.startJob(earlierJob));
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
                store.dispatch(actions.startJob(job));
                store.dispatch(actions.startJob(laterJob));
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
