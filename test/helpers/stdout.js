let originalWrite;
let data;

export function capture() {
  data = Buffer.alloc(0);
  originalWrite = process.stdout.write;
  process.stdout.write = function(_data) {
    _data = Buffer.from(_data);
    data = Buffer.concat([data, _data]);
  };
};

export function restore() {
  process.stdout.write = originalWrite;
  process.stdout.write(data);
};

export function flush() {
  const _data = data;
  data = Buffer.alloc(0);
  return _data;
};
