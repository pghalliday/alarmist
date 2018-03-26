import Service from '../../../../../../src/cli/monitor/ui/view/service';
import Log from '../../../../../../src/cli/monitor/ui/view/log';

let service;

const name = 'name';
const id = 0;
const log = Buffer.from('log');
const startTime = 100000;
const endTime = 200000;
const error = 'message';

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('view', () => {
        describe('Service', () => {
          before(() => {
            service = new Service();
            sinon.spy(service, 'setHeader');
            sinon.spy(service, 'setLog');
          });

          it('should be a Log', () => {
            service.should.be.an.instanceOf(Log);
          });

          describe('_update', () => {
            describe('without an end time', () => {
              before(() => {
                service.setHeader.reset();
                service.setLog.reset();
                service.update({
                  name,
                  id,
                  startTime,
                  log,
                });
              });

              it('should set the header', () => {
                service.setHeader.should.have.been.calledWith(
                  ` ${name}: ok`,
                  'green',
                );
              });

              it('should set the log', () => {
                service.setLog.should.have.been.calledWith(log);
              });
            });

            describe('with an end time', () => {
              before(() => {
                service.setHeader.reset();
                service.setLog.reset();
                service.update({
                  name,
                  id,
                  startTime,
                  endTime,
                  log,
                });
              });

              it('should set the header', () => {
                service.setHeader.should.have.been.calledWith(
                  ` ${name}: ended`,
                  'red',
                );
              });

              it('should set the log', () => {
                service.setLog.should.have.been.calledWith(log);
              });
            });

            describe('with an error', () => {
              before(() => {
                service.setHeader.reset();
                service.setLog.reset();
                service.update({
                  name,
                  id,
                  startTime,
                  endTime,
                  error,
                  log,
                });
              });

              it('should set the header', () => {
                service.setHeader.should.have.been.calledWith(
                  ` ${name}: ${error}`,
                  'red',
                );
              });

              it('should set the log', () => {
                service.setLog.should.have.been.calledWith(log);
              });
            });
          });
        });
      });
    });
  });
});
