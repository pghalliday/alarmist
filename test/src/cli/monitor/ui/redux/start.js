import {createStore} from '../../../../../../src/cli/monitor/ui/redux/store';
import {handleActions} from 'redux-actions';
import {
  reset,
  start,
} from '../../../../../../src/cli/monitor/ui/redux/actions';

let store;
let entries;
let layoutLines;

let spys = {};
const types = {
  type: {
    createReducer: (name) => {
      spys[name] = sinon.spy((state) => state);
      return handleActions({
        [start]: spys[name],
      }, {
        name,
      });
    },
  },
};

const name = 'entry name';
const type = 'type';
const id = 2;
const startTime = 100000;
const laterId = 3;

const otherName = 'other entry name';
const otherId = 1;

const entry = {
  name,
  type,
  id,
  startTime,
};

const laterEntry = {
  name,
  type,
  id: laterId,
  startTime,
};

const otherEntry = {
  name: otherName,
  type,
  id: otherId,
  startTime,
};

const oneEntry = {
  [name]: {
    name,
  },
};

const twoEntries = {
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
        describe('start', () => {
          describe('with an empty state', () => {
            before(() => {
              spys = {};
              store = createStore(types);
              store.dispatch(reset());
              store.dispatch(start(entry));
              const state = store.getState();
              entries = state.entries;
              layoutLines = state.layout.lines;
            });

            it('should add the first entry', () => {
              entries.should.eql(oneEntry);
            });

            it('should add to the layout lines', () => {
              layoutLines.should.eql([
                name,
              ]);
            });

            it('should call the reducer', () => {
              Object.keys(spys).should.eql([name]);
              spys[name].should.have.been.calledWithMatch({
                name,
              }, {
                payload: entry,
              });
            });
          });

          describe('with an existing entry', () => {
            describe('and a new entry name', () => {
              before(() => {
                spys = {};
                store.dispatch(reset());
                store.dispatch(start(entry));
                store.dispatch(start(otherEntry));
                const state = store.getState();
                entries = state.entries;
                layoutLines = state.layout.lines;
              });

              it('should add a second entry', () => {
                entries.should.eql(twoEntries);
              });

              it('should add another entry to the layout lines', () => {
                layoutLines.should.eql([
                  name,
                  otherName,
                ]);
              });

              it('should call the reducers', () => {
                Object.keys(spys).should.eql([name, otherName]);
                spys[name].should.have.been.calledWithMatch({
                  name,
                }, {
                  payload: entry,
                });
                spys[name].should.have.been.calledWithMatch({
                  name,
                }, {
                  payload: otherEntry,
                });
                spys[otherName].should.have.been.calledWithMatch({
                  name: otherName,
                }, {
                  payload: otherEntry,
                });
              });
            });

            describe('and the same entry name', () => {
              before(() => {
                spys = {};
                store.dispatch(reset());
                store.dispatch(start(entry));
                store.dispatch(start(laterEntry));
                const state = store.getState();
                entries = state.entries;
                layoutLines = state.layout.lines;
              });

              it('should not add a second entry', () => {
                entries.should.eql(oneEntry);
              });

              it('should not add another entry to the layout lines', () => {
                layoutLines.should.eql([
                  name,
                ]);
              });

              it('should call the reducer', () => {
                Object.keys(spys).should.eql([name]);
                spys[name].should.have.been.calledWithMatch({
                  name,
                }, {
                  payload: entry,
                });
                spys[name].should.have.been.calledWithMatch({
                  name,
                }, {
                  payload: laterEntry,
                });
              });
            });
          });
        });
      });
    });
  });
});
