import minimist from 'minimist';
import alarmist from '../';
import ui from './ui';

module.exports = function cli(argv) {
  const args = minimist(argv, {
    stopEarly: true,
  });
  return alarmist.execMonitor({
    command: args._[0],
    args: args._.slice(1),
  })
  .then(ui.createUi)
  .catch(
    // istanbul ignore next
    (error) => {
      console.error(error.stack);
    }
  );
};
