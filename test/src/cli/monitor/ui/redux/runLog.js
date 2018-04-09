import {createStore} from '../../../../../../src/cli/monitor/ui/redux/store';
import {handleActions} from 'redux-actions';
import {
  reset,
  runStart,
  runLog,
} from '../../../../../../src/cli/monitor/ui/redux/actions';

let spys = {};
const initialJob = {};
const types = {
  type: {
    createReducer: (name) => {
      spys[name] = sinon.spy((state) => state);
      return handleActions({
        [runLog]: spys[name],
      }, initialJob);
    },
  },
};

const name = 'name';
const type = 'type';
const id = 0;
const startTime = 100000;
const data = Buffer.from('data\n');

const jobStart = {
  name,
  type,
  id,
  startTime,
};

const logData = {
  name,
  type,
  id,
  data,
};

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('redux', () => {
        describe('runLog', () => {
          before(() => {
            const store = createStore(types);
            store.dispatch(reset());
            store.dispatch(runStart(jobStart));
            store.dispatch(runLog(logData));
          });

          it('should call the reducer', () => {
            spys[name].should.have.been.calledWithMatch(initialJob, {
              payload: logData,
            });
          });
        });
      });
    });
  });
});
