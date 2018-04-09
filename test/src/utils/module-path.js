import modulePath from '../../../src/utils/module-path';
import {resolve} from 'path';

const RELATIVE_PATH = './relative';
const RESOLVED_RELATIVE_PATH = resolve(RELATIVE_PATH);
const NODE_MODULES_PATH = 'module';

describe('utils', () => {
  describe('modulePath', () => {
    it('should resolve a relative path', () => {
      modulePath(RELATIVE_PATH).should.eql(RESOLVED_RELATIVE_PATH);
    });

    it('should not resolve a node_modules path', () => {
      modulePath(NODE_MODULES_PATH).should.eql(NODE_MODULES_PATH);
    });
  });
});
