import {
  help,
  parse,
} from '../../../../src/cli/monitor/options';
import _ from 'lodash';
import {
  DEFAULT_WORKING_DIR,
  DEFAULT_COLOR_OPTION,
  DEFAULT_RESET_OPTION,
  NO_COMMAND_ERROR,
  MULTIPLE_WORKING_DIRECTORIES_ERROR,
  MONITOR_USAGE_TEXT,
} from '../../../../src/constants';

const workingDir = 'working dir';
const command = 'command';
const arg1 = '--arg1';
const arg2 = '--arg2';

const noCommand = [
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
  command,
  arg1,
  arg2,
];

const shortOptions = [
  '-r',
  '-c',
  '-w',
  workingDir,
  command,
  arg1,
  arg2,
];

const fullOptions = [
  '--reset',
  '--force-color',
  '--working-dir',
  workingDir,
  command,
  arg1,
  arg2,
];

const negatedOptions = [
  '--no-reset',
  '--no-force-color',
  '--working-dir',
  workingDir,
  command,
  arg1,
  arg2,
];

const workingDirectories = [
  '--working-dir',
  workingDir,
  '--working-dir',
  workingDir,
  command,
  arg1,
  arg2,
];

let options;

describe('cli', () => {
  describe('monitor', () => {
    describe('options', () => {
      describe('#help', () => {
        it('should return the help message', () => {
          help().should.match(
            new RegExp('^' + _.escapeRegExp(MONITOR_USAGE_TEXT))
          );
        });
      });

      describe('#parse', () => {
        _.forEach({
          'with no command': {
            argv: noCommand,
            error: NO_COMMAND_ERROR,
          },
          'with no multiple working directories specified': {
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
            reset: DEFAULT_RESET_OPTION,
            workingDir: DEFAULT_WORKING_DIR,
          },
          'with short options': {
            argv: shortOptions,
            color: true,
            reset: true,
            workingDir,
          },
          'with full options': {
            argv: fullOptions,
            color: true,
            reset: true,
            workingDir,
          },
          'with negated options': {
            argv: negatedOptions,
            color: false,
            reset: false,
            workingDir,
          },
        }, (value, key) => {
          describe(key, () => {
            before(() => {
              options = parse(value.argv);
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

            it('should set the reset option', () => {
              options.reset.should.eql(value.reset);
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
