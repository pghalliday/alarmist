// eslint-disable-next-line max-len
import createView from '../../../../../../../src/cli/monitor/ui/types/line/view';
// eslint-disable-next-line max-len
import Entry from '../../../../../../../src/cli/monitor/ui/types/common/view/entry';

let view;

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('types', () => {
        describe('line', () => {
          describe('createView', () => {
            beforeEach(() => {
              view = createView();
            });

            it('should be an Entry', () => {
              view.should.be.an.instanceof(Entry);
            });
          });
        });
      });
    });
  });
});

