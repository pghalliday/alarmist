import {createJob} from '../../../../../src/cli/ui/view/job';
import Entry from '../../../../../src/cli/ui/view/entry';
import {
  jobLabel,
} from '../../../../../src/cli/ui/helpers';
import path from 'path';
import {
  WORKING_DIR,
  ALL_LOG,
} from '../../../../../src/constants';

let job;

const layout = {};
const entry = {
  setHeader: sinon.spy(),
  setLog: sinon.spy(),
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
          job = createJob(name, layout);
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
              entry.setHeader.reset();
              job.update({
                name,
                id,
              });
            });

            it('should set the header', () => {
              entry.setHeader.should.have.been.calledWith(
                ` ${name}: ${id}: pending`,
                'yellow',
              );
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

          describe('with a new id', () => {
            before(() => {
              entry.setLog.reset();
              job.update({
                name,
                id: newId,
              });
            });

            it('should set the log', () => {
              entry.setLog.should.have.been.calledWith(
                path.join(WORKING_DIR, name, '' + newId, ALL_LOG)
              );
            });

            describe('then with the same id', () => {
              before(() => {
                entry.setLog.reset();
                job.update({
                  name,
                  id: newId,
                });
              });

              it('should not set the log', () => {
                entry.setLog.should.not.have.been.called;
              });
            });
          });
        });
      });
    });
  });
});
