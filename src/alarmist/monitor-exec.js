import logger from '../cli/ui/view/logger';
import * as Monitor from './monitor';
import spawn from 'cross-spawn';

// We start child processes detached and kill them by
// process group because otherwise grandchildren
// will not be killed - of course this means that
// if something goes wrong and cleanup is not called
// then that process group will not be killed. But
// this is the best case as grandchildren will be
// orphaned if not detached anyway (I think)
export async function exec({command, args}) {
  const monitor = await Monitor.createMonitor();
  const proc = spawn(command, args, {
    detached: true,
  });
  let expectExit = false;
  const exitPromise = new Promise((resolve) => {
    proc.on('exit', async (code) => {
      if (!expectExit) {
        delete monitor.cleanup;
        monitor.exit(code);
      }
      resolve();
    });
  });
  proc.stdout.pipe(monitor.log);
  proc.stderr.pipe(monitor.log);
  monitor.cleanup = async () => {
    logger.log('cleanup');
    expectExit = true;
    process.kill(-proc.pid);
    await exitPromise;
  };
  return monitor;
}
