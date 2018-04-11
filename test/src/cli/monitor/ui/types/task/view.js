// eslint-disable-next-line max-len
import createView from '../../../../../../../src/cli/monitor/ui/types/task/view';
import Log from '../../../../../../../src/cli/monitor/ui/types/common/view/log';

let view;

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('types', () => {
        describe('task', () => {
          describe('createView', () => {
            beforeEach(() => {
              view = createView();
            });

            it('should be a Log', () => {
              view.should.be.an.instanceof(Log);
            });
          });
        });
      });
    });
  });
});

