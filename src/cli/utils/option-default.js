import _ from 'lodash';

export default function optionDefault(envVar, defaultValue, transform) {
  let envValue = process.env[envVar];
  if (_.isUndefined(envValue)) {
    return defaultValue;
  }
  if (transform) {
    envValue = transform(envValue);
  }
  return envValue;
}
