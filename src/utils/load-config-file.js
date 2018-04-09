import modulePath from './module-path';

export default async function loadConfigFile(configFile) {
  if (configFile) {
    try {
      return require(modulePath(configFile));
    } catch (_error) {
      return {};
    }
  } else {
    return {};
  }
}
