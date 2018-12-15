import jobCli from '../../../../src/cli/job';
import alarmist from '../../../../src';
import {
  WORKING_DIR,
} from '../../../helpers/constants';
import {
  DEFAULT_WORKING_DIR,
  DEFAULT_COLOR_OPTION,
  DEFAULT_SERVICE_OPTION,
} from '../../../../src/constants';
import rimraf from 'rimraf';
import promisify from '../../../../src/utils/promisify';

const primraf = promisify(rimraf);

const name = 'name';
const command = 'command';
const args = [
  'arg1',
  'arg2',
];
const argv = [name, command].concat(args);

describe('cli', () => {
  describe('job', () => {
    before(async () => {
      sinon.stub(alarmist, 'execJob').callsFake(() => Promise.resolve());
      await primraf(WORKING_DIR);
      await jobCli(argv);
    });
    after(() => {
      alarmist.execJob.restore();
    });

    it('should execute the command', async () => {
      alarmist.execJob.should.have.been.calledWithMatch({
        name,
        command,
        args,
        workingDir: DEFAULT_WORKING_DIR,
        color: DEFAULT_COLOR_OPTION,
        service: DEFAULT_SERVICE_OPTION,
      });
    });
  });
});
