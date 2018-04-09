import loadConfigFile from '../../../src/utils/load-config-file';
import modulePath from '../../../src/utils/module-path';

const MISSING_CONFIG_FILE = 'missing-config-file';
const CONFIG_FILE = './test/config';

const config = require(modulePath(CONFIG_FILE));

describe('utils', () => {
  describe('loadConfigFile', () => {
    it('should return {} if the config file is undefined', async () => {
      await loadConfigFile().should.eventually.eql({});
    });

    it('should return {} if the config file does not exist', async () => {
      await loadConfigFile(MISSING_CONFIG_FILE).should.eventually.eql({});
    });

    it('should return the config from the config file', async () => {
      await loadConfigFile(CONFIG_FILE).should.eventually.eql(config);
    });
  });
});
