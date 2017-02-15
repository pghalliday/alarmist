import {
  lock as _lock,
  unlock as _unlock,
} from 'lockfile';
import {
  readFile as _readFile,
  writeFile as _writeFile,
} from 'fs';
import promisify from './promisify';
import {dirname} from 'path';
import _mkdirp from 'mkdirp';

const lock = promisify(_lock);
const unlock = promisify(_unlock);
const readFile = promisify(_readFile);
const writeFile = promisify(_writeFile);
const mkdirp = promisify(_mkdirp);

async function getId(file) {
  const lockFile = file + '.lock';
  await mkdirp(dirname(file));
  await lock(lockFile, {
    wait: 2000,
  });
  let id = 0;
  try {
    id = parseInt(await readFile(file));
  } catch (_error) {
    // assume the file does not exist yet
    // and do nothing
  }
  id++;
  await writeFile(file, id + '');
  await unlock(lockFile);
  return id;
}

module.exports = {
  getId,
};
