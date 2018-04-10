import {
  createService,
} from '../../../../../src/cli/monitor/ui/service';
import EventEmitter from 'events';

const type = 'type';
let typeService;
const types = {
  [type]: {
    createService: sinon.spy(() => {
      typeService = {
        start: sinon.spy(),
        end: sinon.spy(),
        log: sinon.spy(),
        reset: function() {
          this.start.reset();
          this.end.reset();
          this.log.reset();
        },
      };
      return typeService;
    }),
  },
};
const monitor = new EventEmitter();
monitor.close = async () => Promise.resolve();
const store = 'store';
const service = createService({monitor, store, types});
const status = {
  type,
};

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('service', () => {
        after(async () => {
          await service.stop();
        });

        it('should create the type service', () => {
          types[type].createService.should.have.been.calledWith(store);
        });

        it('should dispatch start actions', () => {
          typeService.reset();
          monitor.emit('start', status);
          typeService.start.should.have.been.calledWith(status);
        });

        it('should dispatch end actions', () => {
          typeService.reset();
          monitor.emit('end', status);
          typeService.end.should.have.been.calledWith(status);
        });

        it('should dispatch log actions', () => {
          typeService.reset();
          monitor.emit('log', status);
          typeService.log.should.have.been.calledWith(status);
        });
      });
    });
  });
});
