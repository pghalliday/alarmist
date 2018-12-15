import Job from '../../../../../../src/cli/monitor/ui/view/job';
import Log from '../../../../../../src/cli/monitor/ui/view/log';

let job;

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
        describe('Job', () => {
          before(() => {
            job = new Job();
            sinon.spy(job, 'setHeader');
            sinon.spy(job, 'setLog');
          });

          it('should be a Log', () => {
            job.should.be.an.instanceOf(Log);
          });

          describe('_update', () => {
            describe('for a service', () => {
              describe('without an end time', () => {
                before(() => {
                  job.setHeader.resetHistory();
                  job.setLog.resetHistory();
                  job.update({
                    name,
                    id,
                    service: true,
                    startTime,
                    log,
                  });
                });

                it('should set the header', () => {
                  job.setHeader.should.have.been.calledWith(
                      ` ${name}: ok`,
                      'green',
                  );
                });

                it('should set the log', () => {
                  job.setLog.should.have.been.calledWith(log);
                });
              });

              describe('with an end time', () => {
                before(() => {
                  job.setHeader.resetHistory();
                  job.setLog.resetHistory();
                  job.update({
                    name,
                    id,
                    service: true,
                    startTime,
                    endTime,
                    log,
                  });
                });

                it('should set the header', () => {
                  job.setHeader.should.have.been.calledWith(
                      ` ${name}: ended`,
                      'red',
                  );
                });

                it('should set the log', () => {
                  job.setLog.should.have.been.calledWith(log);
                });
              });

              describe('with an error', () => {
                before(() => {
                  job.setHeader.resetHistory();
                  job.setLog.resetHistory();
                  job.update({
                    name,
                    id,
                    service: true,
                    startTime,
                    endTime,
                    error,
                    log,
                  });
                });

                it('should set the header', () => {
                  job.setHeader.should.have.been.calledWith(
                      ` ${name}: ${error}`,
                      'red',
                  );
                });

                it('should set the log', () => {
                  job.setLog.should.have.been.calledWith(log);
                });
              });
            });

            describe('for a regular job', () => {
              describe('without an end time', () => {
                before(() => {
                  job.setHeader.resetHistory();
                  job.setLog.resetHistory();
                  job.update({
                    name,
                    id,
                    service: false,
                    startTime,
                    log,
                  });
                });

                it('should set the header', () => {
                  job.setHeader.should.have.been.calledWith(
                      ` ${name}: run ${id}: pending`,
                      'yellow',
                  );
                });

                it('should set the log', () => {
                  job.setLog.should.have.been.calledWith(log);
                });
              });

              describe('with an end time', () => {
                before(() => {
                  job.setHeader.resetHistory();
                  job.setLog.resetHistory();
                  job.update({
                    name,
                    id,
                    service: false,
                    startTime,
                    endTime,
                    log,
                  });
                });

                it('should set the header', () => {
                  job.setHeader.should.have.been.calledWith(
                      ` ${name}: run ${id}: ok`,
                      'green',
                  );
                });

                it('should set the log', () => {
                  job.setLog.should.have.been.calledWith(log);
                });
              });

              describe('with an error', () => {
                before(() => {
                  job.setHeader.resetHistory();
                  job.setLog.resetHistory();
                  job.update({
                    name,
                    id,
                    service: false,
                    startTime,
                    endTime,
                    error,
                    log,
                  });
                });

                it('should set the header', () => {
                  job.setHeader.should.have.been.calledWith(
                      ` ${name}: run ${id}: ${error}`,
                      'red',
                  );
                });

                it('should set the log', () => {
                  job.setLog.should.have.been.calledWith(log);
                });
              });
            });
          });
        });
      });
    });
  });
});
