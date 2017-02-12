import cli from '../../src/cli';
import alarmist from '../../src';
import ui from '../../src/cli/ui';
import {
  EXEC_CMD,
  MONITOR_CMD,
  WORKING_DIR,
} from '../../src/constants';
import _rimraf from 'rimraf';
import promisify from '../../src/utils/promisify';

const rimraf = promisify(_rimraf);

const group = 'group';
const name = 'name';
const command = 'command';

describe('cli', () => {
  describe(EXEC_CMD, () => {
    it('should execute the command', async () => {
      const fnExec = alarmist.exec;
      alarmist.exec = sinon.spy();
      await rimraf(WORKING_DIR);
      await cli([EXEC_CMD, '-g', group, '-n', name, '-c', command]);
      alarmist.exec.should.have.been.calledWithMatch({
        group,
        name,
        command: command,
      });
      alarmist.exec = fnExec;
    });
  });

  describe(MONITOR_CMD, () => {
    let createUi;
    let createMonitor;
    let monitor;

    before(async () => {
      const fnCreateUi = ui.createUi;
      const fnCreateMonitor = alarmist.createMonitor;
      createUi = sinon.spy();
      ui.createUi = createUi;
      monitor = 'monitor';
      createMonitor = sinon.spy(() => Promise.resolve(monitor));
      alarmist.createMonitor = createMonitor;
      await rimraf(WORKING_DIR);
      await cli([MONITOR_CMD, '-g', group]);
      alarmist.createUi = fnCreateUi;
      alarmist.createMonitor = fnCreateMonitor;
    });

    it('should create a monitor', async () => {
      createMonitor.should.have.been.calledWithMatch({
        group,
      });
    });

    it('should create a ui', async () => {
      createUi.should.have.been.calledWith(monitor);
    });
  });
});
