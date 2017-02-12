function createUi(monitor) {
  monitor
  .on('start', ({id, name, startTime}) => {
    console.log(`${name}: ${id}: started: ${startTime}`);
  })
  .on('complete', ({id, name, endTime, exitCode, all}) => {
    console.log(`${all}\n${name}: ${id}: completed: ${endTime}: ${exitCode}`);
  });
};

module.exports = {
  createUi,
};
