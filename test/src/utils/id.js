import {getId} from '../../../src/utils/id';
import {
  WORKING_DIR,
} from '../../../src/constants.js';
import _rimraf from 'rimraf';
import _mkdirp from 'mkdirp';
import promisify from '../../../src/utils/promisify';
import path from 'path';

const rimraf = promisify(_rimraf);
const idFile = path.join(WORKING_DIR, 'id');

describe('alarmist', () => {
  describe('lib', () => {
    describe('getId', () => {
      it('should resolve to sequential ids', async () => {
        await rimraf(WORKING_DIR);
        const ids = await Promise.all([
          getId(idFile),
          getId(idFile),
          getId(idFile),
        ]);
        ids.should.include(1);
        ids.should.include(2);
        ids.should.include(3);
      });
    });
  });
});
