import {createMonitor} from '../../../../../src/cli/ui/view/monitor';
import Entry from '../../../../../src/cli/ui/view/entry';
import {
  MONITOR_LABEL,
} from '../../../../../src/cli/ui/constants';
import {
  WORKING_DIR,
  ALL_LOG,
} from '../../../../../src/constants';
import path from 'path';

let monitor;

const layout = {};
const entry = {
  setHeader: sinon.spy(),
  setLog: sinon.spy(),
};
const createEntry = sinon.spy(() => entry);

describe('cli', () => {
  describe('ui', () => {
    describe('view', () => {
      describe('monitor', () => {
        before(() => {
          const fnCreateEntry = Entry.createEntry;
          createEntry.reset();
          Entry.createEntry = createEntry;
          monitor = createMonitor(layout);
          Entry.createEntry = fnCreateEntry;
        });

        it('should construct an entry', () => {
          createEntry.should.have.been.calledWith(
            MONITOR_LABEL,
            sinon.match.same(layout),
          );
        });

        it('should set the log', () => {
          entry.setLog.should.have.been.calledWith(
            path.join(WORKING_DIR, ALL_LOG)
          );
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
