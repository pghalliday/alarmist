// eslint-disable-next-line max-len
import createService from '../../../../../../../src/cli/monitor/ui/types/service/service';
// eslint-disable-next-line max-len
import Service from '../../../../../../../src/cli/monitor/ui/types/common/service';
import {
  serviceStart,
  serviceLog,
  serviceEnd,
} from '../../../../../../../src/cli/monitor/ui/types/service/reducer';

let service;
let store;

class Store {
  constructor() {
    this.dispatch = sinon.spy();
  }
}

const payload = 'payload';

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('types', () => {
        describe('service', () => {
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
                Service.prototype.start.reset();
                service.start(payload);
              });

              it('should start for super class', () => {
                Service.prototype.start.should.have.been.called;
              });

              it('should dispatch a service start action', () => {
                store.dispatch.should.have.been.calledWith(
                  serviceStart(payload)
                );
              });
            });

            describe('#log', () => {
              beforeEach(() => {
                service.log(payload);
              });

              it('should dispatch a service log action', () => {
                store.dispatch.should.have.been.calledWith(serviceLog(payload));
              });
            });

            describe('#end', () => {
              beforeEach(() => {
                service.end(payload);
              });

              it('should dispatch a service end action', () => {
                store.dispatch.should.have.been.calledWith(serviceEnd(payload));
              });
            });
          });
        });
      });
    });
  });
});

