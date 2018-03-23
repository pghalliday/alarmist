import appendLines from '../../../../src/cli/utils/append-lines';

const MAX_LINES_LENGTH = 3;
const MAX_LINE_LENGTH = 5;
const EMPTY = [''];
const DATA_1 = Buffer.from('1: this is a line\n');
const DATA_2 = Buffer.from('2');
const DATA_3 = Buffer.from('3\n');
const DATA_4 = Buffer.from('4\n');
const DATA_5 = Buffer.from('5\n');
const DATA_6 = Buffer.from('6');
const DATA_7 = Buffer.from('7: this is not a line');

describe('cli', () => {
  describe('utils', () => {
    describe('appendLines', () => {
      it('should not exceed the maximum lines length or line length', () => {
        let lines = EMPTY;

        lines = appendLines(
          MAX_LINES_LENGTH,
          MAX_LINE_LENGTH,
          lines,
          DATA_1
        );

        lines.should.eql([
          '1: th',
          '',
        ]);

        lines = appendLines(MAX_LINES_LENGTH, MAX_LINE_LENGTH, lines, DATA_2);

        lines.should.eql([
          '1: th',
          '2',
        ]);

        lines = appendLines(MAX_LINES_LENGTH, MAX_LINE_LENGTH, lines, DATA_3);

        lines.should.eql([
          '1: th',
          '23',
          '',
        ]);

        lines = appendLines(MAX_LINES_LENGTH, MAX_LINE_LENGTH, lines, DATA_4);

        lines.should.eql([
          '23',
          '4',
          '',
        ]);

        lines = appendLines(MAX_LINES_LENGTH, MAX_LINE_LENGTH, lines, DATA_5);

        lines.should.eql([
          '4',
          '5',
          '',
        ]);

        lines = appendLines(MAX_LINES_LENGTH, MAX_LINE_LENGTH, lines, DATA_6);

        lines.should.eql([
          '4',
          '5',
          '6',
        ]);

        lines = appendLines(MAX_LINES_LENGTH, MAX_LINE_LENGTH, lines, DATA_7);

        lines.should.eql([
          '4',
          '5',
          '67: t',
        ]);
      });
    });
  });
});
