import blessed from 'blessed';
import path from 'path';
import alarmist from '../../';
import logger from './logger';
import cleanup from './cleanup';
import ui from './ui';
import {
  help,
  parse,
} from './options';
import {
  CLI_LOG,
} from '../../constants';
import mkdirp from 'mkdirp';
import promisify from '../../utils/promisify';

const pmkdirp = promisify(mkdirp);

module.exports = async function cli(argv) {
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
  await pmkdirp(opts.workingDir);
  const screen = blessed.screen({
    smartCSR: true,
    log: path.join(opts.workingDir, CLI_LOG),
    debug: opts.debug,
  });
  cleanup.register(screen.destroy.bind(screen));
  // istanbul ignore next
  screen.key(['C-c'], async () => {
    await cleanup.end();
    process.exit(0);
  });
  logger.log = screen.log.bind(screen);
  logger.debug = screen.debug.bind(screen);
  logger.log('created');
  try {
    const monitor = await alarmist.createMonitor(opts);
    cleanup.register(monitor.close.bind(monitor));
    await ui.createUi(Object.assign({}, opts, {
      screen,
      monitor,
    }));
    alarmist.execMonitor(Object.assign({}, opts, {
      monitor,
    }));
  } catch (error) {
    // istanbul ignore next
    cleanup.end().then(() => {
      console.error(error.stack);
      process.exit(1);
    });
  }
};
