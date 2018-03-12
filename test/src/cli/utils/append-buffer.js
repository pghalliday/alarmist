import appendBuffer from '../../../../src/cli/utils/append-buffer';

const MAX_LENGTH = 10;
const EMPTY = Buffer.alloc(0);
const HELLO = Buffer.from('hello!');
const LONG_STRING = Buffer.from('this is a very long string');

describe('cli', () => {
  describe('utils', () => {
    describe('appendBuffer', () => {
      it('should not exceed the maximum length', () => {
        let buffer = appendBuffer(MAX_LENGTH, EMPTY, HELLO);
        buffer.length.should.eql(6);
        buffer.toString('utf8').should.eql('hello!');
        buffer = appendBuffer(MAX_LENGTH, buffer, HELLO);
        buffer.length.should.eql(MAX_LENGTH);
        buffer.toString('utf8').should.eql('llo!hello!');
        buffer = appendBuffer(MAX_LENGTH, buffer, LONG_STRING);
        buffer.length.should.eql(MAX_LENGTH);
        buffer.toString('utf8').should.eql('ong string');
      });
    });
  });
});
