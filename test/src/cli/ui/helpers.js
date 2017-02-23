import {
  jobLabel,
} from '../../../../src/cli/ui/helpers';
import {
  JOB_LABEL_PREFIX,
} from '../../../../src/cli/ui/constants';

describe('cli', () => {
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
