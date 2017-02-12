import promisify from '../../../src/utils/promisify';

function asyncNode(param1, param2, error, callback) {
  process.nextTick(() => {
    if (error) {
      callback(error);
    } else {
      callback(null, param1 + param2, param1 - param2);
    }
  });
}

const asyncPromise = promisify(asyncNode);

describe('utils', () => {
  describe('promisify', () => {
    it('should reject the promise on error', () => {
      return asyncPromise(2, 3, new Error('forced error'))
      .should.be.rejectedWith('forced error');
    });

    it('should resolve with an array of results', () => {
      return asyncPromise(2, 3, null)
      .should.eventually.eql([5, -1]);
    });
  });
});
