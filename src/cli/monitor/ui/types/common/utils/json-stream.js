import SimpleJSONDocStream from 'simple-json-doc-stream';

export default class JSONStream {
  constructor({store, type, actions}) {
    this.stream = new SimpleJSONDocStream();
    actions = actions.reduce((actions, action) => Object.assign(actions, {
      [action]: action,
    }), {});
    this.stream.on('parsed', (obj) => {
      if (obj.target === 'alarmist') {
        if (obj.type === type) {
          const action = actions[obj.action];
          if (action) {
            store.dispatch(action({
              name: this.status.name,
              id: this.status.id,
              data: obj.data,
            }));
          }
        }
      }
    });
    this.stream.on('error', (_error) => {
      // TODO: ignore or debug errors?
    });
  }
  write(status) {
    this.status = status;
    this.stream.write(status.data);
  }
}
