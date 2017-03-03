import Monitor from '../../../../../src/cli/ui/view/monitor';
import Entry from '../../../../../src/cli/ui/view/entry';

let monitor;
let log = Buffer.from('log');
const error = 'message';

describe('cli', () => {
  describe('ui', () => {
    describe('view', () => {
      describe('Monitor', () => {
        before(() => {
          monitor = new Monitor();
          sinon.spy(monitor, 'setHeader');
          sinon.spy(monitor, 'setLog');
        });

        it('should be an Entry', () => {
          monitor.should.be.an.instanceOf(Entry);
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
