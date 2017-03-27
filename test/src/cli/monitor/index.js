import monitorCli from '../../../../src/cli/monitor';
import alarmist from '../../../../src';
import ui from '../../../../src/cli/monitor/ui';
import {
  WORKING_DIR,
} from '../../../helpers/constants';
import {
  DEFAULT_WORKING_DIR,
  DEFAULT_DEBUG_OPTION,
  DEFAULT_COLOR_OPTION,
  DEFAULT_RESET_OPTION,
} from '../../../../src/constants';
import rimraf from 'rimraf';
import promisify from '../../../../src/utils/promisify';

const primraf = promisify(rimraf);

const command = 'command';
const args = [
  'arg1',
  'arg2',
];
const argv = [command].concat(args);
const monitor = 'monitor';

describe('cli', () => {
  describe('monitor', () => {
    before(async () => {
      sinon.stub(ui, 'createUi');
      sinon.stub(alarmist, 'execMonitor', () => Promise.resolve(monitor));
      await primraf(WORKING_DIR);
      await monitorCli(argv);
    });
    after(() => {
      ui.createUi.restore();
      alarmist.execMonitor.restore();
    });

    it('should create a monitor', async () => {
      alarmist.execMonitor.should.have.been.calledWithMatch({
        command,
        args,
        debug: DEFAULT_DEBUG_OPTION,
        color: DEFAULT_COLOR_OPTION,
        reset: DEFAULT_RESET_OPTION,
        workingDir: DEFAULT_WORKING_DIR,
      });
    });

    it('should create a ui', async () => {
      ui.createUi.should.have.been.calledWith(
        monitor,
        DEFAULT_WORKING_DIR,
        DEFAULT_DEBUG_OPTION
      );
    });
  });
});
