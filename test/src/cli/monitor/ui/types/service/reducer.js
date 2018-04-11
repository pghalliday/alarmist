import createReducer, {
  serviceStart,
  serviceLog,
  serviceEnd,
} from '../../../../../../../src/cli/monitor/ui/types/service/reducer';
import {
  createStore,
} from 'redux';

let store;
let state;
const name = 'name';
const unknown = 'unknown';
const id = 1;
const startTime = '1000';
const endTime = '1001';
const error = 'error';
const logData1 = Buffer.from('data1');
const logData2 = Buffer.from('data2');

const EMPTY_BUFFER = Buffer.alloc(0);

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('types', () => {
        describe('service', () => {
          describe('reducer', () => {
            beforeEach(() => {
              store = createStore(createReducer(name));
              state = store.getState();
            });

            describe('initial state', () => {
              it('should have an empty log', () => {
                state.selectors.log(state).should.eql(EMPTY_BUFFER);
              });

              it('should have an initial header', () => {
                state.selectors.header(state).should.eql({
                  text: `${name}: exited`,
                  bgcolor: 'red',
                  fgcolor: 'black',
                });
              });
            });

            describe('on start of unknown service', () => {
              beforeEach(() => {
                store.dispatch(serviceStart({
                  name: unknown,
                  id,
                  startTime,
                }));
                state = store.getState();
              });

              it('should not update the header', () => {
                state.selectors.header(state).should.eql({
                  text: `${name}: exited`,
                  bgcolor: 'red',
                  fgcolor: 'black',
                });
              });
            });

            describe('on start of service with the same id', () => {
              beforeEach(() => {
                store.dispatch(serviceStart({
                  name,
                  id: 0,
                  startTime,
                }));
                state = store.getState();
              });

              it('should not update the header', () => {
                state.selectors.header(state).should.eql({
                  text: `${name}: exited`,
                  bgcolor: 'red',
                  fgcolor: 'black',
                });
              });
            });

            describe('on start of service', () => {
              beforeEach(() => {
                store.dispatch(serviceStart({
                  name,
                  id,
                  startTime,
                }));
                state = store.getState();
              });

              it('should update the header', () => {
                state.selectors.header(state).should.eql({
                  text: `${name}: ok`,
                  bgcolor: 'green',
                  fgcolor: 'black',
                });
              });

              describe('then log some data', () => {
                describe('from an unknown service', () => {
                  beforeEach(() => {
                    store.dispatch(serviceLog({
                      name: unknown,
                      id,
                      logData1,
                    }));
                    state = store.getState();
                  });

                  it('should not update the log', () => {
                    state.selectors.log(state).should.eql(EMPTY_BUFFER);
                  });
                });

                describe('from the wrong service run', () => {
                  beforeEach(() => {
                    store.dispatch(serviceLog({
                      name,
                      id: 0,
                      logData1,
                    }));
                    state = store.getState();
                  });

                  it('should not update the log', () => {
                    state.selectors.log(state).should.eql(EMPTY_BUFFER);
                  });
                });

                describe('from the current service run', () => {
                  beforeEach(() => {
                    store.dispatch(serviceLog({
                      name,
                      id,
                      data: logData1,
                    }));
                    state = store.getState();
                  });

                  it('should update the log', () => {
                    state.selectors.log(state).should.eql(logData1);
                  });

                  describe('then log some more data', () => {
                    beforeEach(() => {
                      store.dispatch(serviceLog({
                        name,
                        id,
                        data: logData2,
                      }));
                      state = store.getState();
                    });

                    it('should update the log', () => {
                      state.selectors.log(state).should.eql(Buffer.concat([
                        logData1,
                        logData2,
                      ]));
                    });

                    describe('then end the service', () => {
                      describe('from an unknown service', () => {
                        beforeEach(() => {
                          store.dispatch(serviceEnd({
                            name: unknown,
                            id,
                            endTime,
                          }));
                          state = store.getState();
                        });

                        it('should not update the header', () => {
                          state.selectors.header(state).should.eql({
                            text: `${name}: ok`,
                            bgcolor: 'green',
                            fgcolor: 'black',
                          });
                        });
                      });

                      describe('from the wrong service run', () => {
                        beforeEach(() => {
                          store.dispatch(serviceEnd({
                            name,
                            id: 0,
                            endTime,
                          }));
                          state = store.getState();
                        });

                        it('should not update the header', () => {
                          state.selectors.header(state).should.eql({
                            text: `${name}: ok`,
                            bgcolor: 'green',
                            fgcolor: 'black',
                          });
                        });
                      });

                      describe('from the current service run', () => {
                        describe('with no error', () => {
                          beforeEach(() => {
                            store.dispatch(serviceEnd({
                              name,
                              id,
                              endTime,
                            }));
                            state = store.getState();
                          });

                          it('should update the header', () => {
                            state.selectors.header(state).should.eql({
                              text: `${name}: exited`,
                              bgcolor: 'red',
                              fgcolor: 'black',
                            });
                          });
                        });

                        describe('with an error', () => {
                          beforeEach(() => {
                            store.dispatch(serviceEnd({
                              name,
                              id,
                              endTime,
                              error,
                            }));
                            state = store.getState();
                          });

                          it('should update the header', () => {
                            state.selectors.header(state).should.eql({
                              text: `${name}: exited: ${error}`,
                              bgcolor: 'red',
                              fgcolor: 'black',
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
