import {createStore} from '../../../../../../src/cli/monitor/ui/redux/store';
import {handleActions} from 'redux-actions';
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

let store;
let jobs;
let layoutLines;

let spys = {};
const types = {
  type: {
    createReducer: (name) => {
      spys[name] = sinon.spy((state) => state);
      return handleActions({
        [runStart]: spys[name],
      }, {
        name,
      });
    },
  },
};

const name = 'job name';
const type = 'type';
const id = 2;
const startTime = 100000;
const laterId = 3;

const otherName = 'other job name';
const otherId = 1;

const job = {
  name,
  type,
  id,
  startTime,
};

const laterJob = {
  name,
  type,
  id: laterId,
  startTime,
};

const otherJob = {
  name: otherName,
  type,
  id: otherId,
  startTime,
};

const oneJob = {
  [name]: {
    name,
  },
};

const twoJobs = {
  [name]: {
    name,
  },
  [otherName]: {
    name: otherName,
  },
};

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('redux', () => {
        describe('runStart', () => {
          describe('with an empty state', () => {
            before(() => {
              spys = {};
              store = createStore(types);
              store.dispatch(reset());
              store.dispatch(runStart(job));
              const state = store.getState();
              jobs = state.jobs;
              layoutLines = state.layout.lines;
            });

            it('should add the first job', () => {
              jobs.should.eql(oneJob);
            });

            it('should add to the layout lines', () => {
              layoutLines.should.eql([
                MONITOR_LABEL,
                jobLabel(name),
              ]);
            });

            it('should call the reducer', () => {
              Object.keys(spys).should.eql([name]);
              spys[name].should.have.been.calledWithMatch({
                name,
              }, {
                payload: job,
              });
            });
          });

          describe('with an existing job', () => {
            describe('and a new job name', () => {
              before(() => {
                spys = {};
                store.dispatch(reset());
                store.dispatch(runStart(job));
                store.dispatch(runStart(otherJob));
                const state = store.getState();
                jobs = state.jobs;
                layoutLines = state.layout.lines;
              });

              it('should add a second job', () => {
                jobs.should.eql(twoJobs);
              });

              it('should add another job to the layout lines', () => {
                layoutLines.should.eql([
                  MONITOR_LABEL,
                  jobLabel(name),
                  jobLabel(otherName),
                ]);
              });

              it('should call the reducers', () => {
                Object.keys(spys).should.eql([name, otherName]);
                spys[name].should.have.been.calledWithMatch({
                  name,
                }, {
                  payload: job,
                });
                spys[name].should.have.been.calledWithMatch({
                  name,
                }, {
                  payload: otherJob,
                });
                spys[otherName].should.have.been.calledWithMatch({
                  name: otherName,
                }, {
                  payload: otherJob,
                });
              });
            });

            describe('and the same job name', () => {
              before(() => {
                spys = {};
                store.dispatch(reset());
                store.dispatch(runStart(job));
                store.dispatch(runStart(laterJob));
                const state = store.getState();
                jobs = state.jobs;
                layoutLines = state.layout.lines;
              });

              it('should not add a second job', () => {
                jobs.should.eql(oneJob);
              });

              it('should not add another job to the layout lines', () => {
                layoutLines.should.eql([
                  MONITOR_LABEL,
                  jobLabel(name),
                ]);
              });

              it('should call the reducer', () => {
                Object.keys(spys).should.eql([name]);
                spys[name].should.have.been.calledWithMatch({
                  name,
                }, {
                  payload: job,
                });
                spys[name].should.have.been.calledWithMatch({
                  name,
                }, {
                  payload: laterJob,
                });
              });
            });
          });
        });
      });
    });
  });
});
