import {
  help,
  parse,
} from '../../../../src/cli/job/options';
import _ from 'lodash';
import {
  DEFAULT_WORKING_DIR,
  DEFAULT_COLOR_OPTION,
  NO_NAME_ERROR,
  NO_COMMAND_ERROR,
  MULTIPLE_WORKING_DIRECTORIES_ERROR,
  JOB_USAGE_TEXT,
} from '../../../../src/constants';

const workingDir = 'working dir';
const name = 'name';
const command = 'command';
const arg1 = '--arg1';
const arg2 = '--arg2';

const noName = [
];

const noCommand = [
  name,
];

const fullVersionOption = [
  '--version',
];

const shortVersionOption = [
  '-v',
];

const fullHelpOption = [
  '--help',
];

const shortHelpOption = [
  '-h',
];

const aliasHelpOption = [
  '-?',
];

const noOptions = [
  name,
  command,
  arg1,
  arg2,
];

const shortOptions = [
  '-c',
  '-w',
  workingDir,
  name,
  command,
  arg1,
  arg2,
];

const fullOptions = [
  '--force-color',
  '--working-dir',
  workingDir,
  name,
  command,
  arg1,
  arg2,
];

const negatedOptions = [
  '--no-force-color',
  '--working-dir',
  workingDir,
  name,
  command,
  arg1,
  arg2,
];

const workingDirectories = [
  '--working-dir',
  workingDir,
  '--working-dir',
  workingDir,
  name,
  command,
  arg1,
  arg2,
];

let options;

describe('cli', () => {
  describe('job', () => {
    describe('options', () => {
      describe('#help', () => {
        it('should return the help message', () => {
          help().should.match(
            new RegExp('^' + _.escapeRegExp(JOB_USAGE_TEXT))
          );
        });
      });

      describe('#parse', () => {
        _.forEach({
          'with no name': {
            argv: noName,
            error: NO_NAME_ERROR,
          },
          'with no command': {
            argv: noCommand,
            error: NO_COMMAND_ERROR,
          },
          'with multiple working directories specified': {
            argv: workingDirectories,
            error: MULTIPLE_WORKING_DIRECTORIES_ERROR,
          },
        }, (value, key) => {
          describe(key, () => {
            before(() => {
              options = parse(value.argv);
            });

            it('should set the error', () => {
              options.error.should.eql(value.error);
            });
          });
        });

        _.forEach({
          'with the full version option': fullVersionOption,
          'with the short version option': shortVersionOption,
        }, (value, key) => {
          describe(key, () => {
            before(() => {
              options = parse(value);
            });

            it('should set the version flag to true', () => {
              options.version.should.eql(true);
            });

            it('should not set the error', () => {
              expect(options.error).to.not.be.ok;
            });
          });
        });

        _.forEach({
          'with the full help option': fullHelpOption,
          'with the short help option': shortHelpOption,
          'with the alias help option': aliasHelpOption,
        }, (value, key) => {
          describe(key, () => {
            before(() => {
              options = parse(value);
            });

            it('should set the help flag to true', () => {
              options.help.should.eql(true);
            });

            it('should not set the error', () => {
              expect(options.error).to.not.be.ok;
            });
          });
        });

        _.forEach({
          'with no options': {
            argv: noOptions,
            color: DEFAULT_COLOR_OPTION,
            workingDir: DEFAULT_WORKING_DIR,
          },
          'with short options': {
            argv: shortOptions,
            color: true,
            workingDir,
          },
          'with full options': {
            argv: fullOptions,
            color: true,
            workingDir,
          },
          'with negated options': {
            argv: negatedOptions,
            color: false,
            workingDir,
          },
        }, (value, key) => {
          describe(key, () => {
            before(() => {
              options = parse(value.argv);
            });

            it('should set the name', () => {
              options.name.should.eql(name);
            });

            it('should set the command', () => {
              options.command.should.eql(command);
            });

            it('should set the args', () => {
              options.args.should.eql([arg1, arg2]);
            });

            it('should set the color option', () => {
              options.color.should.eql(value.color);
            });

            it('should set the working directory', () => {
              options.workingDir.should.eql(value.workingDir);
            });

            it('should set the help flag to false', () => {
              options.help.should.eql(false);
            });

            it('should set the version flag to false', () => {
              options.version.should.eql(false);
            });

            it('should not set the error', () => {
              expect(options.error).to.not.be.ok;
            });
          });
        });
      });
    });
  });
});
