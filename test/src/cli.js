import cli from '../../src/cli';
import alarmist from '../../src';
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
    it('should create a monitor', async () => {
      const fnCreateMonitor = alarmist.createMonitor;
      alarmist.createMonitor = sinon.spy();
      await rimraf(WORKING_DIR);
      await cli([MONITOR_CMD, '-g', group]);
      alarmist.createMonitor.should.have.been.calledWithMatch({
        group,
      });
      alarmist.createMonitor = fnCreateMonitor;
    });
  });
});
