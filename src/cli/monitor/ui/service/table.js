import JSONLog from './json-log';

export default class Table extends JSONLog {
  constructor(params) {
    super(ALARMIST_TABLE, params);
  }
}
