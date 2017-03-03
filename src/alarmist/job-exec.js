import * as Job from './job';
import spawn from 'cross-spawn';

export async function exec({name, command, args}) {
  const job = await Job.createJob(name);
  return await new Promise((resolve) => {
    const proc = spawn(command, args)
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
