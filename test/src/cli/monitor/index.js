import path from 'path';
import monitorCli from '../../../../src/cli/monitor';
import alarmist from '../../../../src';
import blessed from 'blessed';
import helper from '../../../helpers/blessed';
import ui from '../../../../src/cli/monitor/ui';
import {
  DEFAULT_MONITOR_NAME,
  DEFAULT_CONFIG_FILE,
  DEFAULT_WORKING_DIR,
  DEFAULT_DEBUG_OPTION,
  DEFAULT_COLOR_OPTION,
  DEFAULT_RESET_OPTION,
  CLI_LOG,
} from '../../../../src/constants';

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
      helper.reset();
      blessed.screen.reset();
      sinon.stub(ui, 'createUi', () => Promise.resolve());
      sinon.stub(alarmist, 'createMonitor', () => Promise.resolve(monitor));
      sinon.stub(alarmist, 'execMonitor');
      await monitorCli(argv);
    });
    after(() => {
      ui.createUi.restore();
      alarmist.execMonitor.restore();
      alarmist.createMonitor.restore();
    });

    it('should create a monitor and send it to exec', () => {
      alarmist.execMonitor.should.have.been.calledWithMatch({
        monitor,
        command,
        args,
        debug: DEFAULT_DEBUG_OPTION,
        color: DEFAULT_COLOR_OPTION,
        reset: DEFAULT_RESET_OPTION,
        workingDir: DEFAULT_WORKING_DIR,
        name: DEFAULT_MONITOR_NAME,
      });
    });

    it('should create the screen', () => {
      blessed.screen.should.have.been.calledWith({
        smartCSR: true,
        log: path.join(DEFAULT_WORKING_DIR, CLI_LOG),
        debug: DEFAULT_DEBUG_OPTION,
      });
    });

    it('should create a ui', () => {
      ui.createUi.should.have.been.calledWithMatch({
        screen: helper.screen,
        monitor,
        configFile: DEFAULT_CONFIG_FILE,
        workingDir: DEFAULT_WORKING_DIR,
      });
    });
  });
});
