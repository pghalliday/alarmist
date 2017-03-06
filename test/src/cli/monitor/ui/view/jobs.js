import Jobs from '../../../../../../src/cli/monitor/ui/view/jobs';
import {jobLabel} from '../../../../../../src/cli/monitor/ui/helpers';

let jobs;
const layout = {
  append: sinon.spy(),
};
let job;
let lastJob;
class Job {
  constructor() {
    this.update = sinon.spy();
    job = this;
  }
}

const name = 'name';
const anotherName = 'anotherName';

const status = {
  name,
};
const anotherStatus = {
  name: anotherName,
};
const updatedStatus = {
  name: anotherName,
};

const newJob = {
  [name]: status,
};
const anotherNewJob = {
  [name]: status,
  [anotherName]: anotherStatus,
};
const updatedJob = {
  [name]: status,
  [anotherName]: updatedStatus,
};

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('view', () => {
        describe('Jobs', () => {
          before(() => {
            jobs = new Jobs(Job, layout);
          });

          describe('update', () => {
            describe('with a new job', () => {
              before(() => {
                layout.append.reset();
                job = undefined;
                jobs.update(newJob);
              });

              it('should create a new job', () => {
                job.should.be.ok;
              });

              it('should update the new job', () => {
                job.update.should.have.been.calledOnce;
                job.update.should.have.been.calledWith(
                  sinon.match.same(status)
                );
              });

              it('should append the job to the layout', () => {
                layout.append.should.have.been.calledWith(
                  jobLabel(name),
                  job,
                );
              });

              describe('then with another new job', () => {
                before(() => {
                  layout.append.reset();
                  job = undefined;
                  jobs.update(anotherNewJob);
                });

                it('should create a new job', () => {
                  job.should.be.ok;
                });

                it('should update the new job', () => {
                  job.update.should.have.been.calledOnce;
                  job.update.should.have.been.calledWith(
                    sinon.match.same(anotherStatus)
                  );
                });

                it('should append the job to the layout', () => {
                  layout.append.should.have.been.calledWith(
                    jobLabel(anotherName),
                    job,
                  );
                });

                describe('then with an updated job', () => {
                  before(() => {
                    layout.append.reset();
                    job.update.reset();
                    lastJob = job;
                    job = undefined;
                    jobs.update(updatedJob);
                  });

                  it('should not create a new job', () => {
                    expect(job).to.not.be.ok;
                  });

                  it('should not append the job to the layout', () => {
                    layout.append.should.not.have.been.called;
                  });

                  it('should update the job', () => {
                    lastJob.update.should.have.been.calledOnce;
                    lastJob.update.should.have.been.calledWith(
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
});
