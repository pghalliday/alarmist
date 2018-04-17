// eslint-disable-next-line max-len
import createService from '../../../../../../../src/cli/monitor/ui/types/line/service';
// eslint-disable-next-line max-len
import Service from '../../../../../../../src/cli/monitor/ui/types/common/service';
import {
  lineStart,
  lineColors,
  lineAdvance,
  lineValue,
  lineEnd,
} from '../../../../../../../src/cli/monitor/ui/types/line/reducer';

let service;
let store;

class Store {
  constructor() {
    this.dispatch = sinon.spy();
  }
}

const name = 'name';
const id = 'id';
const series = 'series';
const value = 'value';
const error = 'error';
const colors = 'colors';

const colorsPayload = {
  name,
  id,
  data: Buffer.from(JSON.stringify({
    target: 'alarmist',
    type: 'line',
    action: lineColors.toString(),
    data: {
      colors,
    },
  }) + '\n'),
};

const advancePayload = {
  name,
  id,
  data: Buffer.from(JSON.stringify({
    target: 'alarmist',
    type: 'line',
    action: lineAdvance.toString(),
    data: {},
  }) + '\n'),
};

const valuePayload = {
  name,
  id,
  data: Buffer.from(JSON.stringify({
    target: 'alarmist',
    type: 'line',
    action: lineValue.toString(),
    data: {
      series,
      value,
      error,
    },
  }) + '\n'),
};

const unknownTargetPayload = {
  name,
  id,
  data: Buffer.from(JSON.stringify({
    target: 'unknown',
    type: 'line',
    action: lineAdvance.toString(),
    data: {},
  }) + '\n'),
};

const unknownTypePayload = {
  name,
  id,
  data: Buffer.from(JSON.stringify({
    target: 'alarmist',
    type: 'unknown',
    action: lineAdvance.toString(),
    data: {},
  }) + '\n'),
};

const unknownActionPayload = {
  name,
  id,
  data: Buffer.from(JSON.stringify({
    target: 'alarmist',
    type: 'line',
    action: 'unknown',
    data: {},
  }) + '\n'),
};

const payload = 'payload';

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('types', () => {
        describe('line', () => {
          describe('createService', () => {
            beforeEach(() => {
              store = new Store();
              service = createService(store);
              sinon.stub(Service.prototype, 'start');
            });

            afterEach(() => {
              Service.prototype.start.restore();
            });

            it('should be a Service', () => {
              service.should.be.an.instanceof(Service);
            });

            describe('#start', () => {
              beforeEach(() => {
                store.dispatch.reset();
                Service.prototype.start.reset();
                service.start(payload);
              });

              it('should start for super class', () => {
                Service.prototype.start.should.have.been.called;
              });

              it('should dispatch a line start action', () => {
                store.dispatch.should.have.been.calledWith(
                  lineStart(payload)
                );
              });
            });

            describe('#log', () => {
              describe('with invalid payload', () => {
                beforeEach(() => {
                  store.dispatch.reset();
                  service.log(payload);
                });

                it('should not dispatch anything', () => {
                  store.dispatch.should.not.have.been.called;
                });
              });

              describe('an unknown target', () => {
                beforeEach(() => {
                  store.dispatch.reset();
                  service.log(unknownTargetPayload);
                });

                it('should not dispatch anything', () => {
                  store.dispatch.should.not.have.been.called;
                });
              });

              describe('with an unknown type', () => {
                beforeEach(() => {
                  store.dispatch.reset();
                  service.log(unknownTypePayload);
                });

                it('should not dispatch anything', () => {
                  store.dispatch.should.not.have.been.called;
                });
              });

              describe('with an unknown action', () => {
                beforeEach(() => {
                  store.dispatch.reset();
                  service.log(unknownActionPayload);
                });

                it('should not dispatch anything', () => {
                  store.dispatch.should.not.have.been.called;
                });
              });

              describe('with a colors payload', () => {
                beforeEach(() => {
                  store.dispatch.reset();
                  service.log(colorsPayload);
                });

                it('should dispatch a line colors action', () => {
                  store.dispatch.should.have.been.calledWith(
                    lineColors({
                      name,
                      id,
                      colors,
                    }),
                  );
                });
              });

              describe('with an advance payload', () => {
                beforeEach(() => {
                  store.dispatch.reset();
                  service.log(advancePayload);
                });

                it('should dispatch a line advance action', () => {
                  store.dispatch.should.have.been.calledWith(
                    lineAdvance({
                      name,
                      id,
                    }),
                  );
                });
              });

              describe('with a value payload', () => {
                beforeEach(() => {
                  store.dispatch.reset();
                  service.log(valuePayload);
                });

                it('should dispatch a line value action', () => {
                  store.dispatch.should.have.been.calledWith(
                    lineValue({
                      name,
                      id,
                      series,
                      value,
                      error,
                    }),
                  );
                });
              });
            });

            describe('#end', () => {
              beforeEach(() => {
                service.end(payload);
              });

              it('should dispatch a line end action', () => {
                store.dispatch.should.have.been.calledWith(lineEnd(payload));
              });
            });
          });
        });
      });
    });
  });
});

