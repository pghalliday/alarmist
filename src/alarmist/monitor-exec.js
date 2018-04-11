import spawn from 'cross-spawn';
import {
  CONFIG_FILE_VAR,
  WORKING_DIRECTORY_VAR,
  FORCE_COLOR_VAR,
} from '../constants';

// tree-kill gives us a cross-platform
// way to kill children and grandchildren, etc
import kill from 'tree-kill';

export function exec({
  monitor,
  command,
  args,
  color,
  configFile,
  workingDir,
}) {
  const proc = spawn(command, args, {
    env: Object.assign({}, process.env, {
      [CONFIG_FILE_VAR]: configFile,
      [WORKING_DIRECTORY_VAR]: workingDir,
      [FORCE_COLOR_VAR]: color,
    }),
  });
  let expectExit = false;
  const exitPromise = new Promise((resolve) => {
    proc.on('exit', async (code) => {
      if (!expectExit) {
        delete monitor.cleanup;
        monitor.end(`exit code: ${code}`);
      }
      resolve();
    });
  });
  proc.stdout.pipe(monitor.log);
  proc.stderr.pipe(monitor.log);
  monitor.cleanup = async () => {
    expectExit = true;
    kill(proc.pid);
    await exitPromise;
  };
}
