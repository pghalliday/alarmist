import * as Job from './job';
import spawn from 'cross-spawn';

export async function exec({name, command, args}) {
  const job = await Job.createJob(name);
  return await new Promise((resolve) => {
    const proc = spawn(command, args)
    .on('exit', async (exitCode) => {
      await job.exit(exitCode);
      resolve();
    });
    proc.stdout.pipe(job.log);
    proc.stderr.pipe(job.log);
  });
}
