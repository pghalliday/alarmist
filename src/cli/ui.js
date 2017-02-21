function createUi(monitor) {
  monitor
  .on('exit', (code) => {
    console.log(`exit: ${code}`);
  })
  .on('update', ({id, name, startTime, endTime, exitCode}) => {
    if (endTime) {
      console.log(`${name}: ${id}: completed: ${endTime}: ${exitCode}`);
    } else {
      console.log(`${name}: ${id}: started: ${startTime}`);
    }
  });
};

module.exports = {
  createUi,
};
