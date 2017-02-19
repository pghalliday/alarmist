let stdoutWrite;
let stdoutData;
let stderrWrite;
let stderrData;

export function capture() {
  stdoutData = Buffer.alloc(0);
  stderrData = Buffer.alloc(0);
  stdoutWrite = process.stdout.write;
  stderrWrite = process.stderr.write;
  process.stdout.write = function(data) {
    data = Buffer.from(data);
    stdoutData = Buffer.concat([stdoutData, data]);
  };
  process.stderr.write = function(data) {
    data = Buffer.from(data);
    stderrData = Buffer.concat([stderrData, data]);
  };
};

export function restore() {
  process.stdout.write = stdoutWrite;
  process.stderr.write = stderrWrite;
  process.stdout.write(stdoutData);
  process.stderr.write(stderrData);
};

export function flush() {
  const _stdoutData = stdoutData;
  const _stderrData = stderrData;
  stdoutData = Buffer.alloc(0);
  stderrData = Buffer.alloc(0);
  return [_stdoutData, _stderrData];
};
