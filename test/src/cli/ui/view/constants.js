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

        describe('SELECTED_INDICATOR_PROPERTIES', () => {
          it('should define the selected indicator properties', () => {
            constants.SELECTED_INDICATOR_PROPERTIES.should.eql({
              left: 0,
              height: 1,
              content: '\u25ba',
            });
          });
        });

        describe('LOG_PROPERTIES', () => {
          it('should define the scrolling log box properties', () => {
            constants.LOG_PROPERTIES.should.eql({
              left: 3,
              width: '100%-2',
              height: 0,
              keys: true,
              vi: true,
              padding: {
                right: 1,
              },
              scrollbar: {
                ch: ' ',
                inverse: true,
              },
            });
          });
        });

        describe('TAIL_OPTIONS', () => {
          it('should define the tail options', () => {
            constants.TAIL_OPTIONS.should.eql({
              fromBeginning: true,
            });
          });
        });
      });
    });
  });
});
