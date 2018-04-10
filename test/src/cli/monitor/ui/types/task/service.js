// eslint-disable-next-line max-len
import createService from '../../../../../../../src/cli/monitor/ui/types/task/service';
import {
  start,
} from '../../../../../../../src/cli/monitor/ui/redux/actions';
import {
  taskStart,
  taskLog,
  taskEnd,
} from '../../../../../../../src/cli/monitor/ui/types/task/actions';

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
        describe('base', () => {
          describe('Service', () => {
            beforeEach(() => {
              store = new Store();
              service = createService(store);
            });

            describe('#start', () => {
              beforeEach(() => {
                service.start(payload);
              });

              it('should dispatch a start action', () => {
                store.dispatch.should.have.been.calledWith(start(payload));
              });

              it('should dispatch a task start action', () => {
                store.dispatch.should.have.been.calledWith(taskStart(payload));
              });
            });

            describe('#log', () => {
              beforeEach(() => {
                service.log(payload);
              });

              it('should dispatch a task log action', () => {
                store.dispatch.should.have.been.calledWith(taskLog(payload));
              });
            });

            describe('#end', () => {
              beforeEach(() => {
                service.end(payload);
              });

              it('should dispatch a task end action', () => {
                store.dispatch.should.have.been.calledWith(taskEnd(payload));
              });
            });
          });
        });
      });
    });
  });
});

