import minimist from 'minimist';
import alarmist from '../';

module.exports = function job(argv) {
  const args = minimist(argv, {
    string: ['name'],
    alias: {
      name: 'n',
    },
    stopEarly: true,
  });
  return alarmist.execJob({
    name: args.name,
    command: args._[0],
    args: args._.slice(1),
  })
  .catch(
    // istanbul ignore next
    (error) => {
      console.error(error.stack);
    }
  );
};
