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
        if (type) {
          const entry = type.createView(name);
          this.entries[name] = {
            entry: entry,
            status: status,
          };
          this.layout.append(name, entry);
          entry.update(status);
        } else {
          // TODO: log unknown type error
        }
      } else {
        if (status !== existing.status) {
          existing.entry.update(status);
        }
      }
    });
  }
}
