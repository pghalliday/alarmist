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
class Metric {
  constructor() {
    this.update = sinon.spy();
    job = this;
  }
}
class Table {
  constructor() {
    this.update = sinon.spy();
    job = this;
  }
}

const name = 'name';
const service = true;
const metric = true;
const table = true;
const anotherName = 'anotherName';

const status = {
  name,
};
const metricStatus = {
  name,
  service,
  metric,
};
const tableStatus = {
  name,
  service,
  metric,
  table,
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
const newMetric = {
  [name]: metricStatus,
};
const newTable = {
  [name]: tableStatus,
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
          describe('update', () => {
            describe('with a new job', () => {
              before(() => {
                jobs = new Jobs(Job, Metric, Table, layout);
                layout.append.reset();
                job = undefined;
                jobs.update(newJob);
              });

              it('should create a new job', () => {
                job.should.be.an.instanceOf(Job);
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

            describe('with a new metric', () => {
              before(() => {
                jobs = new Jobs(Job, Metric, Table, layout);
                layout.append.reset();
                job = undefined;
                jobs.update(newMetric);
              });

              it('should create a new metric', () => {
                job.should.be.an.instanceOf(Metric);
              });

              it('should update the new metric', () => {
                job.update.should.have.been.calledOnce;
                job.update.should.have.been.calledWith(
                  sinon.match.same(metricStatus)
                );
              });

              it('should append the metric to the layout', () => {
                layout.append.should.have.been.calledWith(
                  jobLabel(name),
                  job,
                );
              });
            });

            describe('with a new table', () => {
              before(() => {
                jobs = new Jobs(Job, Metric, Table, layout);
                layout.append.reset();
                job = undefined;
                jobs.update(newTable);
              });

              it('should create a new table', () => {
                job.should.be.an.instanceOf(Table);
              });

              it('should update the new table', () => {
                job.update.should.have.been.calledOnce;
                job.update.should.have.been.calledWith(
                  sinon.match.same(tableStatus)
                );
              });

              it('should append the table to the layout', () => {
                layout.append.should.have.been.calledWith(
                  jobLabel(name),
                  job,
                );
              });
            });
          });
        });
      });
    });
  });
});
