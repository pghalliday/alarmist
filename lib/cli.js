'use strict';

var _commands;

var _constants = require('./constants');

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _ = require('.');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var commands = (_commands = {}, _defineProperty(_commands, _constants.EXEC_CMD, function (args) {
  return _2.default.exec(args);
}), _defineProperty(_commands, _constants.MONITOR_CMD, function (args) {
  return _2.default.createMonitor(args);
}), _commands);

module.exports = function cli(argv) {
  var args = (0, _minimist2.default)(argv, {
    string: ['group', 'name', 'command'],
    alias: {
      group: 'g',
      name: 'n',
      command: 'c'
    }
  });
  return commands[args._[0]](args);
};