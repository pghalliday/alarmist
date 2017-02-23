import * as constants from '../../../../../src/cli/ui/view/constants';

describe('cli', () => {
  describe('ui', () => {
    describe('view', () => {
      describe('constants', () => {
        describe('TEXT_PROPERTIES', () => {
          it('should define the default text properties', () => {
            constants.TEXT_PROPERTIES.should.eql({
              left: 2,
              width: '100%',
              height: 1,
              style: {
                fg: 'black',
              },
            });
          });
        });
      });
    });
  });
});
