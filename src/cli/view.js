import _ from 'lodash';
import blessed from 'blessed';

// istanbul ignore next
function createView(store) {
  const screen = blessed.screen({
    smartCSR: true,
  });
  screen.title = 'alarmist';
  screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
  const jobs = {};
  const monitor = blessed.text({
    left: 2,
    content: ' monitor: ok',
    width: '100%',
    height: 1,
    style: {
      fg: 'black',
      bg: 'green',
    },
  });
  screen.append(monitor);
  const layout = [monitor];
  function updateMonitor(state) {
    if (state.exitCode) {
      monitor.content = ` monitor: exited: ${state.exitCode}`;
      monitor.style.bg = 'red';
    }
  }
  function updateJobs(state) {
    // eslint-disable-next-line max-len
    const jobContent = (status) => ` ${status.name}: ${status.id}: ${_.isUndefined(status.exitCode) ? 'pending' : status.exitCode}`;
    // eslint-disable-next-line max-len
    const jobBg = (status) => _.isUndefined(status.exitCode) ? 'yellow' : (status.exitCode === 0 ? 'green' : 'red');
    for (let status of state) {
      if (jobs[status.name]) {
        const lastStatus = jobs[status.name].status;
        if (lastStatus !== status) {
          const element = jobs[status.name].element;
          element.content = jobContent(status);
          element.style.bg = jobBg(status);
        }
      } else {
        const element = blessed.text({
          left: 2,
          content: jobContent(status),
          width: '100%',
          height: 1,
          style: {
            fg: 'black',
            bg: jobBg(status),
          },
        });
        jobs[status.name] = {
          element,
          status,
        };
        screen.append(element);
        layout.push(element);
      }
    }
  }
  function updateLayout() {
    let topOffset = 0;
    for (let element of layout) {
      element.top = topOffset;
      topOffset = topOffset + element.height;
    }
  }
  store.subscribe(() => {
    const state = store.getState();
    updateMonitor(state.monitor);
    updateJobs(state.jobs);
    updateLayout();
    screen.render();
  });
  updateLayout();
  screen.render();
}

export {createView};
