import logger from '../../logger';
import _ from 'lodash';

export default class Entries {
  constructor({
    types,
    layout,
  }) {
    this.types = types;
    this.layout = layout;
    this.entries = {};
  }
  update(state) {
    _.forOwn(state, (status, name) => {
      const existing = this.entries[name];
      if (_.isUndefined(existing)) {
        const type = this.types[status.type];
        // istanbul ignore else
        if (type) {
          const entry = type.createView(name);
          this.entries[name] = {
            entry: entry,
            status: status,
          };
          this.layout.append(name, entry);
        } else {
          logger.log(`No view available for this type of entry: ${type}`);
        }
      } else {
        if (status !== existing.status) {
          existing.entry.update(status);
        }
      }
    });
  }
}
