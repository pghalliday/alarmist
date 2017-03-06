import store from '../../../../../../src/cli/monitor/ui/redux/store';
import {
  reset,
  runStart,
  runEnd,
} from '../../../../../../src/cli/monitor/ui/redux/actions';

let jobs;

const name = 'name';
const unknownName = 'unknown name';
const id = 0;
const unknownId = 1;
const startTime = 100000;
const endTime = 200000;
const error = 'message';
const emptyBuffer = Buffer.alloc(0);
const jobStart = {
  name,
  id,
  startTime,
};
const jobEnd = {
  name,
  id,
  startTime,
  endTime,
  error,
};
const jobEndUnknownId = {
  name,
  id: unknownId,
  startTime,
  endTime,
  error,
};
const jobEndUnknownName = {
  name: unknownName,
  id,
  startTime,
  endTime,
  error,
};

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('redux', () => {
        describe('runEnd', () => {
          before(() => {
            store.dispatch(reset());
            store.dispatch(runStart(jobStart));
          });

          describe('with an unknown name', () => {
            before(() => {
              store.dispatch(runEnd(jobEndUnknownName));
              jobs = store.getState().jobs;
            });

            it('should not set the end data', () => {
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
              store.dispatch(runEnd(jobEndUnknownId));
              jobs = store.getState().jobs;
            });

            it('should not set the end data', () => {
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
              store.dispatch(runEnd(jobEnd));
              jobs = store.getState().jobs;
            });

            it('should set the end data', () => {
              jobs.should.eql({
                [name]: {
                  name,
                  id,
                  startTime,
                  endTime,
                  error,
                  log: emptyBuffer,
                },
              });
            });
          });
        });
      });
    });
  });
});
