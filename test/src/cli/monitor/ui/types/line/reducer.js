import {
  forOwn,
} from 'lodash';
import createReducer, {
  lineStart,
  linePoint,
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

const EMPTY_DATA = [];

const series1 = 'series1';
const series1Value1 = 100;
const series1Point1 = {
  series: series1,
  value: series1Value1,
};
const series1Value2 = 200;
const series1Point2 = {
  series: series1,
  value: series1Value2,
};
const series1Value3 = 50;
const series1Point3 = {
  series: series1,
  value: series1Value3,
  error,
};
const series1Value4 = 0;
const series1Point4 = {
  series: series1,
  value: series1Value4,
};

const series2 = 'series2';
const series2Value1 = 125;
const series2Point1 = {
  series: series2,
  value: series2Value1,
};
const series2Value2 = 175;
const series2Point2 = {
  series: series2,
  value: series2Value2,
  error,
};
const series2Value3 = 75;
const series2Point3 = {
  series: series2,
  value: series2Value3,
};

const scenarios = {
  'series are even': {
    points: [
      series1Point1,
      series2Point1,
      series1Point2,
      series2Point2,
      series1Point3,
      series2Point3,
      series1Point4,
    ],
    expected: [{
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
          line: 'green',
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
          line: 'green',
        },
      }, {
        title: series2,
        x: [0],
        y: [series2Value1],
        style: {
          line: 'green',
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
          line: 'green',
        },
      }, {
        title: series2,
        x: [0],
        y: [series2Value1],
        style: {
          line: 'green',
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
          line: 'green',
        },
      }, {
        title: series2,
        x: [0, 1],
        y: [series2Value1, series2Value2],
        style: {
          line: 'red',
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
          line: 'red',
        },
      }, {
        title: series2,
        x: [0, 1],
        y: [series2Value1, series2Value2],
        style: {
          line: 'red',
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
          line: 'red',
        },
      }, {
        title: series2,
        x: [0, 1, 2],
        y: [series2Value1, series2Value2, series2Value3],
        style: {
          line: 'green',
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
          line: 'green',
        },
      }, {
        title: series2,
        x: [0, 1, 2],
        y: [series2Value1, series2Value2, series2Value3],
        style: {
          line: 'green',
        },
      }],
    }],
  },
  'series starts late': {
    points: [
      series1Point1,
      series1Point2,
      series2Point1,
    ],
    expected: [{
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
          line: 'green',
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
          line: 'green',
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
          line: 'green',
        },
      }, {
        title: series2,
        x: [0, 1],
        y: [series2Value1, series2Value1],
        style: {
          line: 'green',
        },
      }],
    }],
  },
  'series skips a point': {
    points: [
      series1Point1,
      series2Point1,
      series1Point2,
      series1Point3,
    ],
    expected: [{
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
          line: 'green',
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
          line: 'green',
        },
      }, {
        title: series2,
        x: [0],
        y: [series2Value1],
        style: {
          line: 'green',
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
          line: 'green',
        },
      }, {
        title: series2,
        x: [0],
        y: [series2Value1],
        style: {
          line: 'green',
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
          line: 'red',
        },
      }, {
        title: series2,
        x: [0, 1],
        y: [series2Value1, series2Value1],
        style: {
          line: 'green',
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
          describe.only('reducer', () => {
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
                    store.dispatch(linePoint(Object.assign({
                      name: unknown,
                      id,
                    }, series1Point1)));
                    state = store.getState();
                  });

                  it('should not update the data', () => {
                    state.selectors.data(state).should.eql(EMPTY_DATA);
                  });
                });

                describe('from the wrong line run', () => {
                  beforeEach(() => {
                    store.dispatch(linePoint(Object.assign({
                      name,
                      id: 0,
                    }, series1Point1)));
                    state = store.getState();
                  });

                  it('should not update the data', () => {
                    state.selectors.data(state).should.eql(EMPTY_DATA);
                  });
                });

                describe('from the current line run', () => {
                  forOwn(scenarios, ({points, expected}, scenario) => {
                    describe(`when ${scenario}`, () => {
                      const submitPoints = (index = 0) => {
                        if (index < points.length) {
                          describe(`after ${index + 1} points`, () => {
                            beforeEach(() => {
                              store.dispatch(linePoint(Object.assign({
                                name,
                                id,
                              }, points[index])));
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

                            submitPoints(index + 1);
                          });
                        }
                      };
                      submitPoints();
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
