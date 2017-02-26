import Job from '../../../../../src/cli/ui/view/job';
import Entry from '../../../../../src/cli/ui/view/entry';

let job;

const name = 'name';
const id = 0;
const log = Buffer.from('log');
const startTime = 100000;
const endTime = 200000;
const exitCode = 0;

describe('cli', () => {
  describe('ui', () => {
    describe('view', () => {
      describe('Job', () => {
        before(() => {
          job = new Job();
          sinon.spy(job, 'setHeader');
          sinon.spy(job, 'setLog');
        });

        it('should be an Entry', () => {
          job.should.be.an.instanceOf(Entry);
        });

        describe('_update', () => {
          describe('without an exit code', () => {
            before(() => {
              job.setHeader.reset();
              job.setLog.reset();
              job.update({
                name,
                id,
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

          describe('with a zero exit code', () => {
            before(() => {
              job.setHeader.reset();
              job.setLog.reset();
              job.update({
                name,
                id,
                startTime,
                endTime,
                exitCode,
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

          describe('with a non-zero exit code', () => {
            before(() => {
              job.setHeader.reset();
              job.setLog.reset();
              job.update({
                name,
                id,
                startTime,
                endTime,
                exitCode: 1,
                log,
              });
            });

            it('should set the header', () => {
              job.setHeader.should.have.been.calledWith(
                ` ${name}: run ${id}: exit code 1`,
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
