import {resolve} from 'path';

export default function modulePath(filePath) {
  if (filePath.startsWith('.')) {
    return resolve(filePath);
  } else {
    return filePath;
  }
}
