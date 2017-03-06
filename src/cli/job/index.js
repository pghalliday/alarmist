import {
  help,
  parse,
} from './options';
import alarmist from '../../';

module.exports = function job(argv) {
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
  return alarmist.execJob(opts)
  .catch(
    // istanbul ignore next
    (error) => {
      console.error(error.stack);
    }
  );
};
