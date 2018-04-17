import {
  forOwn,
} from 'lodash';
import createReducer, {
  lineStart,
  lineAdvance,
  lineValue,
  lineEnd,
} from '../../../../../../../src/cli/monitor/ui/types/line/reducer';
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

const COLOR_1 = 'white';
const COLOR_2 = 'yellow';

const EMPTY_DATA = [];

const action = {
  name,
  id,
};

const advanceAction = lineAdvance(Object.assign({}, action));

const series1 = 'series1';
const series1Value1 = 100;
const series1Value1Action = lineValue(Object.assign({}, action, {
  series: series1,
  value: series1Value1,
}));
const series1Value2 = 200;
const series1Value2Action = lineValue(Object.assign({}, action, {
  series: series1,
  value: series1Value2,
}));
const series1Value3 = 50;
const series1Value3Action = lineValue(Object.assign({}, action, {
  series: series1,
  value: series1Value3,
  error,
}));
const series1Value4 = 0;
const series1Value4Action = lineValue(Object.assign({}, action, {
  series: series1,
  value: series1Value4,
}));

const series2 = 'series2';
const series2Value1 = 125;
const series2Value1Action = lineValue(Object.assign({}, action, {
  series: series2,
  value: series2Value1,
}));
const series2Value2 = 175;
const series2Value2Action = lineValue(Object.assign({}, action, {
  series: series2,
  value: series2Value2,
  error,
}));
const series2Value3 = 75;
const series2Value3Action = lineValue(Object.assign({}, action, {
  series: series2,
  value: series2Value3,
}));

const scenarios = {
  'has not yet advanced': {
    actions: [
      series1Value1Action,
    ],
    expected: [{
      header: {
        text: `${name}: ready`,
        bgcolor: 'green',
        fgcolor: 'black',
      },
      data: EMPTY_DATA,
    }],
  },
  'series writes twice before advance': {
    actions: [
      advanceAction,
      series1Value1Action,
      series1Value2Action,
    ],
    expected: [{
      header: {
        text: `${name}: ready`,
        bgcolor: 'green',
        fgcolor: 'black',
      },
      data: EMPTY_DATA,
    }, {
      header: {
        text: `${name}: ${series1}: ${series1Value1}`,
        bgcolor: 'green',
        fgcolor: 'black',
      },
      data: [{
        title: series1,
        x: [0],
        y: [series1Value1],
        style: {
          line: COLOR_1,
        },
      }],
    }, {
      header: {
        text: `${name}: ${series1}: ${series1Value2}`,
        bgcolor: 'green',
        fgcolor: 'black',
      },
      data: [{
        title: series1,
        x: [0],
        y: [series1Value2],
        style: {
          line: COLOR_1,
        },
      }],
    }],
  },
  'series are even': {
    actions: [
      advanceAction,
      series1Value1Action,
      series2Value1Action,
      advanceAction,
      series1Value2Action,
      series2Value2Action,
      advanceAction,
      series1Value3Action,
      series2Value3Action,
      advanceAction,
      series1Value4Action,
    ],
    expected: [{
      header: {
        text: `${name}: ready`,
        bgcolor: 'green',
        fgcolor: 'black',
      },
      data: EMPTY_DATA,
    }, {
      header: {
        text: `${name}: ${series1}: ${series1Value1}`,
        bgcolor: 'green',
        fgcolor: 'black',
      },
      data: [{
        title: series1,
        x: [0],
        y: [series1Value1],
        style: {
          line: COLOR_1,
        },
      }],
    }, {
      header: {
        text: `${name}: ${series2}: ${series2Value1}`,
        bgcolor: 'green',
        fgcolor: 'black',
      },
      data: [{
        title: series1,
        x: [0],
        y: [series1Value1],
        style: {
          line: COLOR_1,
        },
      }, {
        title: series2,
        x: [0],
        y: [series2Value1],
        style: {
          line: COLOR_2,
        },
      }],
    }, {
      header: {
        text: `${name}: ${series2}: ${series2Value1}`,
        bgcolor: 'green',
        fgcolor: 'black',
      },
      data: [{
        title: series1,
        x: [0, 1],
        y: [series1Value1],
        style: {
          line: COLOR_1,
        },
      }, {
        title: series2,
        x: [0, 1],
        y: [series2Value1],
        style: {
          line: COLOR_2,
        },
      }],
    }, {
      header: {
        text: `${name}: ${series1}: ${series1Value2}`,
        bgcolor: 'green',
        fgcolor: 'black',
      },
      data: [{
        title: series1,
        x: [0, 1],
        y: [series1Value1, series1Value2],
        style: {
          line: COLOR_1,
        },
      }, {
        title: series2,
        x: [0, 1],
        y: [series2Value1],
        style: {
          line: COLOR_2,
        },
      }],
    }, {
      header: {
        text: `${name}: ${series2}: ${series2Value2}: ${error}`,
        bgcolor: 'red',
        fgcolor: 'black',
      },
      data: [{
        title: series1,
        x: [0, 1],
        y: [series1Value1, series1Value2],
        style: {
          line: COLOR_1,
        },
      }, {
        title: series2,
        x: [0, 1],
        y: [series2Value1, series2Value2],
        style: {
          line: COLOR_2,
        },
      }],
    }, {
      header: {
        text: `${name}: ${series2}: ${series2Value2}: ${error}`,
        bgcolor: 'red',
        fgcolor: 'black',
      },
      data: [{
        title: series1,
        x: [0, 1, 2],
        y: [series1Value1, series1Value2],
        style: {
          line: COLOR_1,
        },
      }, {
        title: series2,
        x: [0, 1, 2],
        y: [series2Value1, series2Value2],
        style: {
          line: COLOR_2,
        },
      }],
    }, {
      header: {
        text: `${name}: ${series1}: ${series1Value3}: ${error}`,
        bgcolor: 'red',
        fgcolor: 'black',
      },
      data: [{
        title: series1,
        x: [0, 1, 2],
        y: [series1Value1, series1Value2, series1Value3],
        style: {
          line: COLOR_1,
        },
      }, {
        title: series2,
        x: [0, 1, 2],
        y: [series2Value1, series2Value2],
        style: {
          line: COLOR_2,
        },
      }],
    }, {
      header: {
        text: `${name}: ${series1}: ${series1Value3}: ${error}`,
        bgcolor: 'red',
        fgcolor: 'black',
      },
      data: [{
        title: series1,
        x: [0, 1, 2],
        y: [series1Value1, series1Value2, series1Value3],
        style: {
          line: COLOR_1,
        },
      }, {
        title: series2,
        x: [0, 1, 2],
        y: [series2Value1, series2Value2, series2Value3],
        style: {
          line: COLOR_2,
        },
      }],
    }, {
      header: {
        text: `${name}: ${series1}: ${series1Value3}: ${error}`,
        bgcolor: 'red',
        fgcolor: 'black',
      },
      data: [{
        title: series1,
        x: [0, 1, 2, 3],
        y: [series1Value1, series1Value2, series1Value3],
        style: {
          line: COLOR_1,
        },
      }, {
        title: series2,
        x: [0, 1, 2, 3],
        y: [series2Value1, series2Value2, series2Value3],
        style: {
          line: COLOR_2,
        },
      }],
    }, {
      header: {
        text: `${name}: ${series1}: ${series1Value4}`,
        bgcolor: 'green',
        fgcolor: 'black',
      },
      data: [{
        title: series1,
        x: [0, 1, 2, 3],
        y: [series1Value1, series1Value2, series1Value3, series1Value4],
        style: {
          line: COLOR_1,
        },
      }, {
        title: series2,
        x: [0, 1, 2, 3],
        y: [series2Value1, series2Value2, series2Value3],
        style: {
          line: COLOR_2,
        },
      }],
    }],
  },
  'series starts late': {
    actions: [
      advanceAction,
      series1Value1Action,
      advanceAction,
      series1Value2Action,
      series2Value1Action,
    ],
    expected: [{
      header: {
        text: `${name}: ready`,
        bgcolor: 'green',
        fgcolor: 'black',
      },
      data: EMPTY_DATA,
    }, {
      header: {
        text: `${name}: ${series1}: ${series1Value1}`,
        bgcolor: 'green',
        fgcolor: 'black',
      },
      data: [{
        title: series1,
        x: [0],
        y: [series1Value1],
        style: {
          line: COLOR_1,
        },
      }],
    }, {
      header: {
        text: `${name}: ${series1}: ${series1Value1}`,
        bgcolor: 'green',
        fgcolor: 'black',
      },
      data: [{
        title: series1,
        x: [0, 1],
        y: [series1Value1],
        style: {
          line: COLOR_1,
        },
      }],
    }, {
      header: {
        text: `${name}: ${series1}: ${series1Value2}`,
        bgcolor: 'green',
        fgcolor: 'black',
      },
      data: [{
        title: series1,
        x: [0, 1],
        y: [series1Value1, series1Value2],
        style: {
          line: COLOR_1,
        },
      }],
    }, {
      header: {
        text: `${name}: ${series2}: ${series2Value1}`,
        bgcolor: 'green',
        fgcolor: 'black',
      },
      data: [{
        title: series1,
        x: [0, 1],
        y: [series1Value1, series1Value2],
        style: {
          line: COLOR_1,
        },
      }, {
        title: series2,
        x: [0, 1],
        y: [series2Value1, series2Value1],
        style: {
          line: COLOR_2,
        },
      }],
    }],
  },
  'series skips a point': {
    actions: [
      advanceAction,
      series1Value1Action,
      series2Value1Action,
      advanceAction,
      series1Value2Action,
      advanceAction,
      series1Value3Action,
      series2Value2Action,
    ],
    expected: [{
      header: {
        text: `${name}: ready`,
        bgcolor: 'green',
        fgcolor: 'black',
      },
      data: EMPTY_DATA,
    }, {
      header: {
        text: `${name}: ${series1}: ${series1Value1}`,
        bgcolor: 'green',
        fgcolor: 'black',
      },
      data: [{
        title: series1,
        x: [0],
        y: [series1Value1],
        style: {
          line: COLOR_1,
        },
      }],
    }, {
      header: {
        text: `${name}: ${series2}: ${series2Value1}`,
        bgcolor: 'green',
        fgcolor: 'black',
      },
      data: [{
        title: series1,
        x: [0],
        y: [series1Value1],
        style: {
          line: COLOR_1,
        },
      }, {
        title: series2,
        x: [0],
        y: [series2Value1],
        style: {
          line: COLOR_2,
        },
      }],
    }, {
      header: {
        text: `${name}: ${series2}: ${series2Value1}`,
        bgcolor: 'green',
        fgcolor: 'black',
      },
      data: [{
        title: series1,
        x: [0, 1],
        y: [series1Value1],
        style: {
          line: COLOR_1,
        },
      }, {
        title: series2,
        x: [0, 1],
        y: [series2Value1],
        style: {
          line: COLOR_2,
        },
      }],
    }, {
      header: {
        text: `${name}: ${series1}: ${series1Value2}`,
        bgcolor: 'green',
        fgcolor: 'black',
      },
      data: [{
        title: series1,
        x: [0, 1],
        y: [series1Value1, series1Value2],
        style: {
          line: COLOR_1,
        },
      }, {
        title: series2,
        x: [0, 1],
        y: [series2Value1],
        style: {
          line: COLOR_2,
        },
      }],
    }, {
      header: {
        text: `${name}: ${series1}: ${series1Value2}`,
        bgcolor: 'green',
        fgcolor: 'black',
      },
      data: [{
        title: series1,
        x: [0, 1, 2],
        y: [series1Value1, series1Value2],
        style: {
          line: COLOR_1,
        },
      }, {
        title: series2,
        x: [0, 1, 2],
        y: [series2Value1],
        style: {
          line: COLOR_2,
        },
      }],
    }, {
      header: {
        text: `${name}: ${series1}: ${series1Value3}: ${error}`,
        bgcolor: 'red',
        fgcolor: 'black',
      },
      data: [{
        title: series1,
        x: [0, 1, 2],
        y: [series1Value1, series1Value2, series1Value3],
        style: {
          line: COLOR_1,
        },
      }, {
        title: series2,
        x: [0, 1, 2],
        y: [series2Value1],
        style: {
          line: COLOR_2,
        },
      }],
    }, {
      header: {
        text: `${name}: ${series2}: ${series2Value2}: ${error}`,
        bgcolor: 'red',
        fgcolor: 'black',
      },
      data: [{
        title: series1,
        x: [0, 1, 2],
        y: [series1Value1, series1Value2, series1Value3],
        style: {
          line: COLOR_1,
        },
      }, {
        title: series2,
        x: [0, 1, 2],
        y: [series2Value1, (series2Value1 + series2Value2) / 2, series2Value2],
        style: {
          line: COLOR_2,
        },
      }],
    }],
  },
};

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('types', () => {
        describe('line', () => {
          describe('reducer', () => {
            beforeEach(() => {
              store = createStore(createReducer(name));
              state = store.getState();
            });

            describe('initial state', () => {
              it('should have empty data', () => {
                state.selectors.data(state).should.eql(EMPTY_DATA);
              });

              it('should have an initial header', () => {
                state.selectors.header(state).should.eql({
                  text: `${name}: exited`,
                  bgcolor: 'red',
                  fgcolor: 'black',
                });
              });
            });

            describe('on start of unknown line', () => {
              beforeEach(() => {
                store.dispatch(lineStart({
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

            describe('on start of line with the same id', () => {
              beforeEach(() => {
                store.dispatch(lineStart({
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

            describe('on start of line', () => {
              beforeEach(() => {
                store.dispatch(lineStart({
                  name,
                  id,
                  startTime,
                }));
                state = store.getState();
              });

              it('should update the header', () => {
                state.selectors.header(state).should.eql({
                  text: `${name}: ready`,
                  bgcolor: 'green',
                  fgcolor: 'black',
                });
              });

              describe('then receive some data', () => {
                describe('from an unknown line', () => {
                  beforeEach(() => {
                    store.dispatch(lineValue({
                      name: unknown,
                      id,
                      series: series1,
                      value: series1Value1,
                    }));
                    state = store.getState();
                  });

                  it('should not update the data', () => {
                    state.selectors.data(state).should.eql(EMPTY_DATA);
                  });
                });

                describe('from the wrong line run', () => {
                  beforeEach(() => {
                    store.dispatch(lineValue({
                      name,
                      id: 0,
                      series: series1,
                      value: series1Value1,
                    }));
                    state = store.getState();
                  });

                  it('should not update the data', () => {
                    state.selectors.data(state).should.eql(EMPTY_DATA);
                  });
                });

                describe('from the current line run', () => {
                  forOwn(scenarios, ({actions, expected}, scenario) => {
                    describe(`when ${scenario}`, () => {
                      const submitActions = (index = 0) => {
                        if (index < actions.length) {
                          describe(`after ${index + 1} actions`, () => {
                            beforeEach(() => {
                              store.dispatch(actions[index]);
                              state = store.getState();
                            });

                            it('should have the correct header', () => {
                              state.selectors.header(state).should.eql(
                                expected[index].header
                              );
                            });

                            it('should have the correct data', () => {
                              state.selectors.data(state).should.eql(
                                expected[index].data
                              );
                            });

                            submitActions(index + 1);
                          });
                        }
                      };
                      submitActions();
                    });
                  });

                  describe('then end the line', () => {
                    describe('from an unknown line', () => {
                      beforeEach(() => {
                        store.dispatch(lineEnd({
                          name: unknown,
                          id,
                          endTime,
                        }));
                        state = store.getState();
                      });

                      it('should not update the header', () => {
                        state.selectors.header(state).should.eql({
                          text: `${name}: ready`,
                          bgcolor: 'green',
                          fgcolor: 'black',
                        });
                      });
                    });

                    describe('from the wrong line run', () => {
                      beforeEach(() => {
                        store.dispatch(lineEnd({
                          name,
                          id: 0,
                          endTime,
                        }));
                        state = store.getState();
                      });

                      it('should not update the header', () => {
                        state.selectors.header(state).should.eql({
                          text: `${name}: ready`,
                          bgcolor: 'green',
                          fgcolor: 'black',
                        });
                      });
                    });

                    describe('from the current line run', () => {
                      describe('with no error', () => {
                        beforeEach(() => {
                          store.dispatch(lineEnd({
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
                          store.dispatch(lineEnd({
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
