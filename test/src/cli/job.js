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
const args = [
  'arg1',
  'arg2',
];
const argv = ['-n', name, command].concat(args);

describe('cli', () => {
  describe('job', () => {
    it('should execute the command', async () => {
      const fnExecJob = alarmist.execJob;
      alarmist.execJob = sinon.spy(() => Promise.resolve());
      await rimraf(WORKING_DIR);
      await jobCli(argv);
      alarmist.execJob.should.have.been.calledWith({
        name,
        command,
        args,
      });
      alarmist.exec = fnExecJob;
    });
  });
});
