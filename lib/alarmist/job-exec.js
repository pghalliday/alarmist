"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exec = exec;

var Job = _interopRequireWildcard(require("./job"));

var _crossSpawn = _interopRequireDefault(require("cross-spawn"));

var _constants = require("../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

async function exec({
  name,
  command,
  args,
  workingDir,
  service,
  metric,
  color
}) {
  const job = await Job.createJob({
    workingDir,
    name,
    service,
    metric
  });
  return await new Promise(resolve => {
    const proc = (0, _crossSpawn.default)(command, args, {
      env: Object.assign({}, process.env, {
        [_constants.FORCE_COLOR_VAR]: color
      })
    }).on('exit', async code => {
      const error = code !== 0 ? `exit code: ${code}` : undefined;
      await job.end(error);
      resolve();
    });
    proc.stdout.pipe(job.log);
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(job.log);
    proc.stderr.pipe(process.stderr);
  });
}