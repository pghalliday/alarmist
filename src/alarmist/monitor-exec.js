import * as Monitor from './monitor';
import {spawn} from 'pty.js';

export async function exec({command, args, options}) {
  const monitor = await Monitor.createMonitor();
  const term = spawn(command, args, options);
  let expectExit = false;
  const exitPromise = new Promise((resolve) => {
    term.on('exit', async (code) => {
      if (!expectExit) {
        delete monitor.cleanup;
        monitor.exit(code);
      }
      resolve();
    });
  });
  term.on('data', (data) => {
    monitor.log.write(Buffer.from(data));
  });
  monitor.cleanup = async () => {
    expectExit = true;
    term.kill();
    await exitPromise;
  };
  return monitor;
}
