import store from '../../../../../src/cli/ui/redux/store';
import {
  reset,
  start,
  jobLog,
} from '../../../../../src/cli/ui/redux/actions';

let jobs;

const name = 'name';
const unknownName = 'unknown name';
const id = 0;
const unknownId = 1;
const startTime = 100000;
const emptyBuffer = Buffer.alloc(0);
const data1 = Buffer.from('data1');
const data2 = Buffer.from('data2');
const allData = Buffer.concat([data1, data2]);
const jobStart = {
  name,
  id,
  startTime,
};
const logData1 = {
  name,
  id,
  data: data1,
};
const logData2 = {
  name,
  id,
  data: data2,
};
const logUnknownId = {
  name,
  id: unknownId,
  data: data1,
};
const logUnknownName = {
  name: unknownName,
  id,
  data: data1,
};

describe('cli', () => {
  describe('ui', () => {
    describe('redux', () => {
      describe('jobLog', () => {
        before(() => {
          store.dispatch(reset());
          store.dispatch(start(jobStart));
        });

        describe('with an unknown name', () => {
          before(() => {
            store.dispatch(jobLog(logUnknownName));
            jobs = store.getState().jobs;
          });

          it('should not set any log data', () => {
            jobs.should.eql({
              [name]: {
                name,
                id,
                startTime,
                log: emptyBuffer,
              },
            });
          });
        });

        describe('with an unknown id', () => {
          before(() => {
            store.dispatch(jobLog(logUnknownId));
            jobs = store.getState().jobs;
          });

          it('should not set any log data', () => {
            jobs.should.eql({
              [name]: {
                name,
                id,
                startTime,
                log: emptyBuffer,
              },
            });
          });
        });

        describe('with a known name and id', () => {
          before(() => {
            store.dispatch(jobLog(logData1));
            jobs = store.getState().jobs;
          });

          it('should set the log data', () => {
            jobs.should.eql({
              [name]: {
                name,
                id,
                startTime,
                log: data1,
              },
            });
          });

          describe('when dispatched again', () => {
            before(() => {
              store.dispatch(jobLog(logData2));
              jobs = store.getState().jobs;
            });

            it('should append the new data', () => {
              jobs.should.eql({
                [name]: {
                  name,
                  id,
                  startTime,
                  log: allData,
                },
              });
            });
          });
        });
      });
    });
  });
});
