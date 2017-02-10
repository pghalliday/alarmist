import test from '../../src/index.js';
import chai from 'chai';

chai.should();

describe('test', () => {
  it('should pass', () => {
    test().should.eql('hello world');
  });
});
