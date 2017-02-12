'use strict';

function createUi(monitor) {
  monitor.on('start', function (_ref) {
    var id = _ref.id,
        name = _ref.name,
        startTime = _ref.startTime;

    console.log(name + ': ' + id + ': started: ' + startTime);
  }).on('complete', function (_ref2) {
    var id = _ref2.id,
        name = _ref2.name,
        endTime = _ref2.endTime,
        exitCode = _ref2.exitCode,
        all = _ref2.all;

    console.log(all + '\n' + name + ': ' + id + ': completed: ' + endTime + ': ' + exitCode);
  });
};

module.exports = {
  createUi: createUi
};