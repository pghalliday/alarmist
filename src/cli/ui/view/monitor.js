import _ from 'lodash';
import blessed from 'blessed';

export function createMonitor(layout) {
  const element = blessed.text({
    left: 2,
    width: '100%',
    height: 1,
    style: {
      fg: 'black',
    },
  });
  layout.append(element);
  return {
    update: (state) => {
      if (_.isUndefined(state.exitCode)) {
        element.content = ' monitor: ok';
        element.style.bg = 'green';
      } else {
        element.content = ` monitor: exited: ${state.exitCode}`;
        element.style.bg = 'red';
      }
    },
  };
}
