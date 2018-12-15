"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exec = exec;

var Job = _interopRequireWildcard(require("./job"));

var _crossSpawn = _interopRequireDefault(require("cross-spawn"));

var _constants = require("../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

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