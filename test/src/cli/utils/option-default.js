import optionDefault from '../../../../src/cli/utils/option-default';

describe('cli', () => {
  describe('utils', () => {
    describe('optionDefault', () => {
      before(() => {
        process.env['__TEST_VAR_SET__'] = 'false';
      });

      describe('with the environment variable set', () => {
        describe('without a transform method', () => {
          it('should use the environment variable', () => {
            optionDefault('__TEST_VAR_SET__', true).should.eql('false');
          });
        });

        describe('with a transform method', () => {
          it('should transform the environment variable', () => {
            optionDefault(
              '__TEST_VAR_SET__',
              true,
              (value) => value === 'true',
            ).should.eql(false);
          });
        });
      });

      describe('with the environment variable not set', () => {
        it('should use the passed in default', () => {
          optionDefault('__TEST_VAR_UNSET__', true).should.eql(true);
        });
      });
    });
  });
});
