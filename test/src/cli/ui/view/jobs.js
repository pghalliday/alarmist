import {createJobs} from '../../../../../src/cli/ui/view/jobs';
import Job from '../../../../../src/cli/ui/view/job';

let jobs;
const layout = {};
const job = {
  update: sinon.spy(),
};
const createJob = sinon.spy(() => job);
const status = {
  name: 'name',
};
const anotherStatus = {
  name: 'anotherName',
};
const updatedStatus = {
  name: 'name',
};

const newJob = {
  name: status,
};

const anotherNewJob = {
  name: status,
  anothername: anotherStatus,
};

const updatedJob = {
  name: updatedStatus,
  anothername: anotherStatus,
};

describe('cli', () => {
  describe('ui', () => {
    describe('view', () => {
      describe('jobs', () => {
        before(() => {
          jobs = createJobs(layout);
        });

        describe('update', () => {
          describe('with a new job', () => {
            before(() => {
              createJob.reset();
              job.update.reset();
              const fnCreateJob = Job.createJob;
              Job.createJob = createJob;
              jobs.update(newJob);
              Job.createJob = fnCreateJob;
            });

            it('should create a new job', () => {
              createJob.should.have.been.calledOnce;
              createJob.should.have.been.calledWith(
                sinon.match.same(layout)
              );
            });

            it('should update the new job', () => {
              job.update.should.have.been.calledOnce;
              job.update.should.have.been.calledWith(
                sinon.match.same(status)
              );
            });

            describe('then with another new job', () => {
              before(() => {
                createJob.reset();
                job.update.reset();
                const fnCreateJob = Job.createJob;
                Job.createJob = createJob;
                jobs.update(anotherNewJob);
                Job.createJob = fnCreateJob;
              });

              it('should create a new job', () => {
                createJob.should.have.been.calledOnce;
                createJob.should.have.been.calledWith(
                  sinon.match.same(layout)
                );
              });

              it('should update the new job', () => {
                job.update.should.have.been.calledOnce;
                job.update.should.have.been.calledWith(
                  sinon.match.same(anotherStatus)
                );
              });

              describe('then with an updated job', () => {
                before(() => {
                  createJob.reset();
                  job.update.reset();
                  const fnCreateJob = Job.createJob;
                  Job.createJob = createJob;
                  jobs.update(updatedJob);
                  Job.createJob = fnCreateJob;
                });

                it('should not create a new job', () => {
                  createJob.should.have.not.have.been.called;
                });

                it('should update the job', () => {
                  job.update.should.have.been.calledOnce;
                  job.update.should.have.been.calledWith(
                    sinon.match.same(updatedStatus)
                  );
                });
              });
            });
          });
        });
      });
    });
  });
});
