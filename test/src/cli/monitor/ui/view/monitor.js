import Monitor from '../../../../../../src/cli/monitor/ui/view/monitor';
import Log from '../../../../../../src/cli/monitor/ui/view/log';

let monitor;
let log = Buffer.from('log');
const error = 'message';

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('view', () => {
        describe('Monitor', () => {
          before(() => {
            monitor = new Monitor();
            sinon.spy(monitor, 'setHeader');
            sinon.spy(monitor, 'setLog');
          });

          it('should be a Log', () => {
            monitor.should.be.an.instanceOf(Log);
          });

          describe('_update', () => {
            describe('with an error', () => {
              before(() => {
                monitor._update({
                  error,
                  log,
                });
              });

              it('should set the header', () => {
                monitor.setHeader.should.have.been.calledWith(
                  ` monitor: ${error}`,
                  'red',
                );
              });

              it('should set the log', () => {
                monitor.setLog.should.have.been.calledWith(log);
              });
            });

            describe('without an error', () => {
              before(() => {
                monitor._update({
                  log,
                });
              });

              it('should set the header', () => {
                monitor.setHeader.should.have.been.calledWith(
                  ' monitor: ok',
                  'green',
                );
              });

              it('should set the log', () => {
                monitor.setLog.should.have.been.calledWith(log);
              });
            });
          });
        });
      });
    });
  });
});
