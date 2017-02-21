import minimist from 'minimist';
import alarmist from '../';

module.exports = function job(argv) {
  const args = minimist(argv, {
    string: ['name', 'command'],
    alias: {
      name: 'n',
      command: 'c',
    },
  });
  return alarmist.execJob(args);
};
