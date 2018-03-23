import * as Job from './job';
import spawn from 'cross-spawn';
import {
  FORCE_COLOR_VAR,
} from '../constants';

export async function exec({
  name,
  command,
  args,
  workingDir,
  service,
  metric,
  color,
}) {
  const job = await Job.createJob({
    workingDir,
    name,
    service,
    metric,
  });
  return await new Promise((resolve) => {
    const proc = spawn(command, args, {
      env: Object.assign({}, process.env, {
        [FORCE_COLOR_VAR]: color,
      }),
    })
    .on('exit', async (code) => {
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
