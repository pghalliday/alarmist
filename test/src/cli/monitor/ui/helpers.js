import {
  jobLabel,
} from '../../../../../src/cli/monitor/ui/helpers';
import {
  JOB_LABEL_PREFIX,
} from '../../../../../src/cli/monitor/ui/constants';

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('helpers', () => {
        describe('jobLabel', () => {
          it('should construct an internal job UI label', () => {
            jobLabel('name').should.eql(`${JOB_LABEL_PREFIX}name`);
          });
        });
      });
    });
  });
});
