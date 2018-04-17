import SimpleJSONDocStream from 'simple-json-doc-stream';

export default class JSONStream {
  constructor({store, type, actions}) {
    this.stream = new SimpleJSONDocStream();
    actions = actions.reduce((actions, action) => Object.assign(actions, {
      [action]: action,
    }), {});
    this.stream.on('parsed', (data) => {
      console.log(data);
      if (data.target === 'alarmist') {
        if (data.type === type) {
          const action = actions[data.action];
          if (action) {
            store.dispatch(action(Object.assign({
              name: this.status.name,
              id: this.status.id,
            }, data.data)));
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
