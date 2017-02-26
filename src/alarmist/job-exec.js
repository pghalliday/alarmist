import * as Job from './job';
import {spawn} from 'pty.js';

export async function exec({name, command, args, options}) {
  const job = await Job.createJob({name});
  return await new Promise((resolve) => {
    const term = spawn(command, args, options).on('exit', async (exitCode) => {
      await job.exit(exitCode);
      resolve();
    });
    term.on('data', (data) => {
      job.log.write(Buffer.from(data));
    });
  });
}
