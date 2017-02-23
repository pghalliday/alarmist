import * as constants from '../../../../src/cli/ui/constants';

describe('cli', () => {
  describe('ui', () => {
    describe('constants', () => {
      describe('MONITOR_LABEL', () => {
        // eslint-disable-next-line max-len
        it('should define the internal label for the monitor UI element', () => {
          constants.MONITOR_LABEL.should.eql('monitor');
        });
      });

      describe('JOB_LABEL_PREFIX', () => {
        // eslint-disable-next-line max-len
        it('should define the prefix to use for the internal labels of job UI elements', () => {
          constants.JOB_LABEL_PREFIX.should.eql('job:');
        });
      });
    });
  });
});
