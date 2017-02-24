import {createMonitor} from '../../../../../src/cli/ui/view/monitor';
import Entry from '../../../../../src/cli/ui/view/entry';
import {
  MONITOR_LABEL,
} from '../../../../../src/cli/ui/constants';

let monitor;

const layout = {};
const entry = {
  setHeader: sinon.spy(),
  clear: sinon.spy(),
  log: sinon.spy(),
};
const createEntry = sinon.spy(() => entry);
const service = {
  reset: () => service.callback = undefined,
  log: (data) => {
    service.callback(data);
  },
  subscribeMonitorLog: (callback) => {
    service.callback = callback;
  },
};

describe('cli', () => {
  describe('ui', () => {
    describe('view', () => {
      describe('monitor', () => {
        before(() => {
          service.reset();
          const fnCreateEntry = Entry.createEntry;
          createEntry.reset();
          Entry.createEntry = createEntry;
          monitor = createMonitor(service, layout);
          service.log('log data');
          Entry.createEntry = fnCreateEntry;
        });

        it('should construct an entry', () => {
          createEntry.should.have.been.calledWith(
            MONITOR_LABEL,
            sinon.match.same(layout),
          );
        });

        it('should clear the log', () => {
          entry.clear.should.have.been.calledOnce;
        });

        it('should submit log entries', () => {
          entry.log.should.have.been.calledWith('log data');
        });

        describe('update', () => {
          describe('with an exit code', () => {
            before(() => {
              entry.setHeader.reset();
              monitor.update({
                exitCode: 0,
              });
            });

            it('should set the header', () => {
              entry.setHeader.should.have.been.calledWith(
                ' monitor: exited: 0',
                'red',
              );
            });
          });

          describe('without an exit code', () => {
            before(() => {
              entry.setHeader.reset();
              monitor.update({});
            });

            it('should set the header', () => {
              entry.setHeader.should.have.been.calledWith(
                ' monitor: ok',
                'green',
              );
            });
          });
        });
      });
    });
  });
});
