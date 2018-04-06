import {
  help,
  parse,
} from '../../../../src/cli/job/options';
import _ from 'lodash';
import {
  DEFAULT_WORKING_DIR,
  DEFAULT_CONFIG_FILE,
  DEFAULT_COLOR_OPTION,
  DEFAULT_TYPE_OPTION,
  NO_NAME_ERROR,
  NO_COMMAND_ERROR,
  MULTIPLE_WORKING_DIRECTORIES_ERROR,
  MULTIPLE_CONFIG_FILES_ERROR,
  MULTIPLE_TYPES_ERROR,
  JOB_USAGE_TEXT,
} from '../../../../src/constants';

const configFile = 'config file';
const workingDir = 'working dir';
const type = 'type';
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
  '-f',
  '-t',
  type,
  '-c',
  configFile,
  '-w',
  workingDir,
  name,
  command,
  arg1,
  arg2,
];

const fullOptions = [
  '--force-color',
  '--type',
  type,
  '--config-file',
  configFile,
  '--working-dir',
  workingDir,
  name,
  command,
  arg1,
  arg2,
];

const negatedOptions = [
  '--no-force-color',
  '--type',
  type,
  '--config-file',
  configFile,
  '--working-dir',
  workingDir,
  name,
  command,
  arg1,
  arg2,
];

const types = [
  '--type',
  type,
  '--type',
  type,
  name,
  command,
  arg1,
  arg2,
];

const configFiles = [
  '--config-file',
  configFile,
  '--config-file',
  configFile,
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
          'with multiple config files specified': {
            argv: configFiles,
            error: MULTIPLE_CONFIG_FILES_ERROR,
          },
          'with multiple working directories specified': {
            argv: workingDirectories,
            error: MULTIPLE_WORKING_DIRECTORIES_ERROR,
          },
          'with multiple types specified': {
            argv: types,
            error: MULTIPLE_TYPES_ERROR,
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
            type: DEFAULT_TYPE_OPTION,
            configFile: DEFAULT_CONFIG_FILE,
            workingDir: DEFAULT_WORKING_DIR,
          },
          'with short options': {
            argv: shortOptions,
            color: true,
            type,
            configFile,
            workingDir,
          },
          'with full options': {
            argv: fullOptions,
            color: true,
            type,
            configFile,
            workingDir,
          },
          'with negated options': {
            argv: negatedOptions,
            color: false,
            type,
            configFile,
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

            it('should set the type option', () => {
              options.type.should.eql(value.type);
            });

            it('should set the config file', () => {
              options.configFile.should.eql(value.configFile);
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
