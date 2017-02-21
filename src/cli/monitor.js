import minimist from 'minimist';
import alarmist from '../';
import ui from './ui';

module.exports = function cli(argv) {
  const args = minimist(argv, {
    string: ['command'],
    alias: {
      command: 'c',
    },
  });
  return alarmist.execMonitor(args)
  .then(ui.createUi);
};
