"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exec = exec;

var Monitor = _interopRequireWildcard(require("./monitor"));

var _crossSpawn = _interopRequireDefault(require("cross-spawn"));

var _constants = require("../constants");

var _treeKill = _interopRequireDefault(require("tree-kill"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// tree-kill gives us a cross-platform
// way to kill children and grandchildren, etc
async function exec({
  command,
  args,
  reset,
  color,
  workingDir
}) {
  const monitor = await Monitor.createMonitor({
    reset,
    workingDir
  });
  const proc = (0, _crossSpawn.default)(command, args, {
    env: Object.assign({}, process.env, {
      [_constants.WORKING_DIRECTORY_VAR]: workingDir,
      [_constants.FORCE_COLOR_VAR]: color
    })
  });
  let expectExit = false;
  const exitPromise = new Promise(resolve => {
    proc.on('exit', async code => {
      if (!expectExit) {
        delete monitor.cleanup;
        monitor.end(`exit code: ${code}`);
      }

      resolve();
    });
  });
  proc.stdout.pipe(monitor.log);
  proc.stderr.pipe(monitor.log);

  monitor.cleanup = async () => {
    expectExit = true;
    (0, _treeKill.default)(proc.pid);
    await exitPromise;
  };

  return monitor;
}