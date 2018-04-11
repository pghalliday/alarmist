import path from 'path';
import monitorCli from '../../../../src/cli/monitor';
import alarmist from '../../../../src';
import blessed from 'blessed';
import helper from '../../../helpers/blessed';
import ui from '../../../../src/cli/monitor/ui';
import {
  WORKING_DIR,
} from '../../../helpers/constants';
import {
  DEFAULT_MONITOR_NAME,
  DEFAULT_CONFIG_FILE,
  DEFAULT_WORKING_DIR,
  DEFAULT_DEBUG_OPTION,
  DEFAULT_COLOR_OPTION,
  DEFAULT_RESET_OPTION,
  CLI_LOG,
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
const monitor = {
  start: sinon.spy(),
};

describe('cli', () => {
  describe('monitor', () => {
    before(async () => {
      helper.reset();
      blessed.screen.reset();
      monitor.start.reset();
      sinon.stub(ui, 'createUi');
      sinon.stub(alarmist, 'execMonitor', () => Promise.resolve(monitor));
      await primraf(WORKING_DIR);
      await monitorCli(argv);
    });
    after(() => {
      ui.createUi.restore();
      alarmist.execMonitor.restore();
    });

    it('should create a monitor', () => {
      alarmist.execMonitor.should.have.been.calledWithMatch({
        command,
        args,
        debug: DEFAULT_DEBUG_OPTION,
        color: DEFAULT_COLOR_OPTION,
        reset: DEFAULT_RESET_OPTION,
        workingDir: DEFAULT_WORKING_DIR,
        name: DEFAULT_MONITOR_NAME,
      });
    });

    it('should start the monitor', () => {
      monitor.start.should.have.been.called;
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
