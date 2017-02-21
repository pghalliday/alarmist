'use strict';

function createUi(monitor) {
  monitor.on('exit', function (code) {
    console.log('exit: ' + code);
  }).on('update', function (_ref) {
    var id = _ref.id,
        name = _ref.name,
        startTime = _ref.startTime,
        endTime = _ref.endTime,
        exitCode = _ref.exitCode;

    if (endTime) {
      console.log(name + ': ' + id + ': completed: ' + endTime + ': ' + exitCode);
    } else {
      console.log(name + ': ' + id + ': started: ' + startTime);
    }
  });
};

module.exports = {
  createUi: createUi
};