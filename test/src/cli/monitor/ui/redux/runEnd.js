import {createStore} from '../../../../../../src/cli/monitor/ui/redux/store';
import {handleActions} from 'redux-actions';
import {
  reset,
  runStart,
  runEnd,
} from '../../../../../../src/cli/monitor/ui/redux/actions';

let spys = {};
const initialJob = {};
const types = {
  type: {
    createReducer: (name) => {
      spys[name] = sinon.spy((state) => state);
      return handleActions({
        [runEnd]: spys[name],
      }, initialJob);
    },
  },
};

const name = 'name';
const type = 'type';
const id = 0;
const startTime = 100000;
const endTime = 200000;
const error = 'message';
const jobStart = {
  name,
  type,
  id,
  startTime,
};
const jobEnd = {
  name,
  type,
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
            const store = createStore(types);
            store.dispatch(reset());
            store.dispatch(runStart(jobStart));
            store.dispatch(runEnd(jobEnd));
          });

          it('should call the reducer', () => {
            spys[name].should.have.been.calledWithMatch(initialJob, {
              payload: jobEnd,
            });
          });
        });
      });
    });
  });
});
