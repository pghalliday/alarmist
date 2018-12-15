import alarmist from '../../';
import ui from './ui';
import {
  help,
  parse,
} from './options';

module.exports = function cli(argv) {
  const opts = parse(argv);
  // istanbul ignore next
  if (opts.version) {
    console.log(require('../../../package.json').version);
    process.exit(0);
  }
  // istanbul ignore next
  if (opts.help) {
    process.stdout.write(help());
    process.exit(0);
  }
  // istanbul ignore next
  if (opts.error) {
    console.log('ERROR: ' + opts.error);
    process.stdout.write(help());
    process.exit(1);
  }
  return alarmist.execMonitor(opts)
      .then((monitor) => ui.createUi(monitor, opts.workingDir, opts.debug))
      .catch(
          // istanbul ignore next
          (error) => {
            console.error(error.stack);
          }
      );
};
