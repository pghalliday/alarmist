// eslint-disable-next-line max-len
import Service from '../../../../../../../src/cli/monitor/ui/types/common/service';
import {
  start,
} from '../../../../../../../src/cli/monitor/ui/redux/actions';

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
        describe('common', () => {
          describe('Service', () => {
            beforeEach(() => {
              store = new Store();
              service = new Service(store);
            });

            describe('#start', () => {
              beforeEach(() => {
                service.start(payload);
              });

              it('should dispatch a start action', () => {
                store.dispatch.should.have.been.calledWith(start(payload));
              });
            });
          });
        });
      });
    });
  });
});

