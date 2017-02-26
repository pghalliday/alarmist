import store from '../../../../../src/cli/ui/redux/store';
import {
  reset,
  start,
  end,
} from '../../../../../src/cli/ui/redux/actions';

let jobs;

const name = 'name';
const unknownName = 'unknown name';
const id = 0;
const unknownId = 1;
const startTime = 100000;
const endTime = 200000;
const exitCode = 0;
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
  exitCode,
};
const jobEndUnknownId = {
  name,
  id: unknownId,
  startTime,
  endTime,
  exitCode,
};
const jobEndUnknownName = {
  name: unknownName,
  id,
  startTime,
  endTime,
  exitCode,
};

describe('cli', () => {
  describe('ui', () => {
    describe('redux', () => {
      describe('end', () => {
        before(() => {
          store.dispatch(reset());
          store.dispatch(start(jobStart));
        });

        describe('with an unknown name', () => {
          before(() => {
            store.dispatch(end(jobEndUnknownName));
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
            store.dispatch(end(jobEndUnknownId));
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
            store.dispatch(end(jobEnd));
            jobs = store.getState().jobs;
          });

          it('should set the end data', () => {
            jobs.should.eql({
              [name]: {
                name,
                id,
                startTime,
                endTime,
                exitCode,
                log: emptyBuffer,
              },
            });
          });
        });
      });
    });
  });
});
