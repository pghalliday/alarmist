import store from '../../../../../../src/cli/monitor/ui/redux/store';
import {
  reset,
  runStart,
  runLog,
} from '../../../../../../src/cli/monitor/ui/redux/actions';

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
  describe('monitor', () => {
    describe('ui', () => {
      describe('redux', () => {
        describe('runLog', () => {
          before(() => {
            store.dispatch(reset());
            store.dispatch(runStart(jobStart));
          });

          describe('with an unknown name', () => {
            before(() => {
              store.dispatch(runLog(logUnknownName));
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
              store.dispatch(runLog(logUnknownId));
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
              store.dispatch(runLog(logData1));
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
                store.dispatch(runLog(logData2));
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
});
