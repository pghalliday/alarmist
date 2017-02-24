import {createJob} from '../../../../../src/cli/ui/view/job';
import Entry from '../../../../../src/cli/ui/view/entry';
import {
  jobLabel,
} from '../../../../../src/cli/ui/helpers';

let job;

const layout = {};
const service = {
  reset: () => {
    service.callback = undefined;
    service.unsubscribe.reset();
    service.subscribeJobLog.reset();
  },
  unsubscribe: sinon.spy(),
  subscribeJobLog: sinon.spy((name, id, callback) => {
    service.callback = callback;
    return service.unsubscribe;
  }),
  log: (data) => {
    service.callback(data);
  },
};
const entry = {
  setHeader: sinon.spy(),
  clear: sinon.spy(),
  log: sinon.spy(),
};
const createEntry = sinon.spy(() => entry);
const name = 'name';
const id = 0;
const newId = 1;

describe('cli', () => {
  describe('ui', () => {
    describe('view', () => {
      describe('job', () => {
        before(() => {
          const fnCreateEntry = Entry.createEntry;
          createEntry.reset();
          Entry.createEntry = createEntry;
          job = createJob(name, service, layout);
          Entry.createEntry = fnCreateEntry;
        });

        it('should construct an entry', () => {
          createEntry.should.have.been.calledWith(
            jobLabel(name),
            sinon.match.same(layout),
          );
        });

        describe('update', () => {
          describe('without an exit code', () => {
            before(() => {
              service.reset();
              entry.setHeader.reset();
              entry.clear.reset();
              entry.log.reset();
              job.update({
                name,
                id,
              });
              service.log('log data');
            });

            it('should set the header', () => {
              entry.setHeader.should.have.been.calledWith(
                ` ${name}: ${id}: pending`,
                'yellow',
              );
            });

            it('should clear the log', () => {
              entry.clear.should.have.been.calledOnce;
            });

            it('should subscribe to the new job log', () => {
              service.subscribeJobLog.should.have.been.calledWith(
                name,
                id,
              );
            });

            it('should update the log on log entries', () => {
              entry.log.should.have.been.calledWith('log data');
            });

            describe('then with a new id', () => {
              before(() => {
                service.reset();
                entry.clear.reset();
                entry.log.reset();
                job.update({
                  name,
                  id: newId,
                });
                service.log('new log data');
              });

              it('should clear the log', () => {
                entry.clear.should.have.been.calledOnce;
              });

              it('should unsubscribe from the old job log', () => {
                service.unsubscribe.should.have.been.calledOnce;
              });

              it('should subscribe to the new job log', () => {
                service.subscribeJobLog.should.have.been.calledWith(
                  name,
                  newId,
                );
              });

              it('should update the log on log entries', () => {
                entry.log.should.have.been.calledWith('new log data');
              });
            });
          });

          describe('with a zero exit code', () => {
            before(() => {
              entry.setHeader.reset();
              job.update({
                name,
                id,
                exitCode: 0,
              });
            });

            it('should set the header', () => {
              entry.setHeader.should.have.been.calledWith(
                ` ${name}: ${id}: 0`,
                'green',
              );
            });
          });

          describe('with a non-zero exit code', () => {
            before(() => {
              entry.setHeader.reset();
              job.update({
                name,
                id,
                exitCode: 1,
              });
            });

            it('should set the header', () => {
              entry.setHeader.should.have.been.calledWith(
                ` ${name}: ${id}: 1`,
                'red',
              );
            });
          });
        });
      });
    });
  });
});
