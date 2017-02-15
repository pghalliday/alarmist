import * as Monitor from './monitor';
import {exec as cpExec} from 'child_process';

export async function exec({command}) {
  const monitor = await Monitor.createMonitor();
  const proc = cpExec(command);
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
  proc.stdout.pipe(monitor.stdout);
  proc.stderr.pipe(monitor.stderr);
  monitor.cleanup = async () => {
    expectExit = true;
    proc.kill();
    await exitPromise;
  };
  return monitor;
}
