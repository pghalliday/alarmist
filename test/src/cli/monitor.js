import monitorCli from '../../../src/cli/monitor';
import alarmist from '../../../src';
import ui from '../../../src/cli/ui';
import {
  WORKING_DIR,
} from '../../../src/constants';
import _rimraf from 'rimraf';
import promisify from '../../../src/utils/promisify';

const rimraf = promisify(_rimraf);

const command = 'command';

describe('cli', () => {
  describe('monitor', () => {
    let createUi;
    let execMonitor;
    let monitor;

    before(async () => {
      const fnCreateUi = ui.createUi;
      const fnExecMonitor = alarmist.execMonitor;
      createUi = sinon.spy();
      ui.createUi = createUi;
      monitor = 'monitor';
      execMonitor = sinon.spy(() => Promise.resolve(monitor));
      alarmist.execMonitor = execMonitor;
      await rimraf(WORKING_DIR);
      await monitorCli(['-c', command]);
      ui.createUi = fnCreateUi;
      alarmist.execMonitor = fnExecMonitor;
    });

    it('should create a monitor', async () => {
      execMonitor.should.have.been.calledWithMatch({
        command,
      });
    });

    it('should create a ui', async () => {
      createUi.should.have.been.calledWith(monitor);
    });
  });
});
