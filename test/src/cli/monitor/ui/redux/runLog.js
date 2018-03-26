import store from '../../../../../../src/cli/monitor/ui/redux/store';
import {
  reset,
  runStart,
  runLog,
} from '../../../../../../src/cli/monitor/ui/redux/actions';
import {
  TYPE_JOB,
  TYPE_TABLE,
  TYPE_METRIC,
  TYPE_SERVICE,
} from '../../../../../../src/cli/monitor/ui/constants';

let jobs;

const name = 'name';
const unknownName = 'unknown name';
const id = 0;
const unknownId = 1;
const startTime = 100000;
const emptyBuffer = Buffer.alloc(0);
const emptyLines = [''];
const data1 = Buffer.from('data1\n');
const lines1 = ['data1', ''];
const data2 = Buffer.from('data2\n');
const allData = Buffer.concat([data1, data2]);
const allLines = ['data1', 'data2', ''];

const jobStart = {
  name,
  id,
  startTime,
};
const serviceStart = {
  name,
  id,
  startTime,
  service: true,
};
const metricStart = {
  name,
  id,
  startTime,
  service: true,
  metric: true,
};
const tableStart = {
  name,
  id,
  startTime,
  service: true,
  metric: true,
  table: true,
};

const testCases = {
  job: {
    start: jobStart,
    type: TYPE_JOB,
    empty: {
      log: emptyBuffer,
    },
    data: {
      log: data1,
    },
    allData: {
      log: allData,
    },
  },
  service: {
    start: serviceStart,
    type: TYPE_SERVICE,
    empty: {
      log: emptyBuffer,
    },
    data: {
      log: data1,
    },
    allData: {
      log: allData,
    },
  },
  metric: {
    start: metricStart,
    type: TYPE_METRIC,
    empty: {
      lines: emptyLines,
    },
    data: {
      lines: lines1,
    },
    allData: {
      lines: allLines,
    },
  },
  table: {
    start: tableStart,
    type: TYPE_TABLE,
    empty: {
    },
    data: {
    },
    allData: {
    },
  },
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
          Object.keys(testCases).forEach((testCase) => {
            const testData = testCases[testCase];
            describe(`with ${testCase}`, () => {
              before(() => {
                store.dispatch(reset());
                store.dispatch(runStart(testData.start));
              });

              describe('with an unknown name', () => {
                before(() => {
                  store.dispatch(runLog(logUnknownName));
                  jobs = store.getState().jobs;
                });

                it('should not set any data', () => {
                  jobs.should.eql({
                    [name]: Object.assign({
                      type: testData.type,
                    }, testData.start, testData.empty),
                  });
                });
              });

              describe('with an unknown id', () => {
                before(() => {
                  store.dispatch(runLog(logUnknownId));
                  jobs = store.getState().jobs;
                });

                it('should not set any data', () => {
                  jobs.should.eql({
                    [name]: Object.assign({
                      type: testData.type,
                    }, testData.start, testData.empty),
                  });
                });
              });

              describe('with a known name and id', () => {
                before(() => {
                  store.dispatch(runLog(logData1));
                  jobs = store.getState().jobs;
                });

                it('should set the data', () => {
                  jobs.should.eql({
                    [name]: Object.assign({
                      type: testData.type,
                    }, testData.start, testData.data),
                  });
                });

                describe('when dispatched again', () => {
                  before(() => {
                    store.dispatch(runLog(logData2));
                    jobs = store.getState().jobs;
                  });

                  it('should update the data', () => {
                    jobs.should.eql({
                      [name]: Object.assign({
                        type: testData.type,
                      }, testData.start, testData.allData),
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
