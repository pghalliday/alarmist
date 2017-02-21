import jobCli from '../../../src/cli/job';
import alarmist from '../../../src';
import {
  WORKING_DIR,
} from '../../../src/constants';
import _rimraf from 'rimraf';
import promisify from '../../../src/utils/promisify';

const rimraf = promisify(_rimraf);

const name = 'name';
const command = 'command';

describe('cli', () => {
  describe('job', () => {
    it('should execute the command', async () => {
      const fnExecJob = alarmist.execJob;
      alarmist.execJob = sinon.spy();
      await rimraf(WORKING_DIR);
      await jobCli(['-n', name, '-c', command]);
      alarmist.execJob.should.have.been.calledWithMatch({
        name,
        command,
      });
      alarmist.exec = fnExecJob;
    });
  });
});
