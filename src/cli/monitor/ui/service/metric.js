import JSONLog from './json-log';

export default class Metric extends JSONLog {
  constructor(params) {
    super(ALARMIST_METRIC, params);
  }
}
