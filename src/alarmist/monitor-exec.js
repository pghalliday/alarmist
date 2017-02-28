import * as Monitor from './monitor';
import spawn from 'cross-spawn';

export async function exec({command, args}) {
  const monitor = await Monitor.createMonitor();
  const proc = spawn(command, args, {stdio: 'pipe'});
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
    expectExit = true;
    proc.kill();
    await exitPromise;
  };
  return monitor;
}
