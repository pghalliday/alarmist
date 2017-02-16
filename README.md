# alarmist

**IN DEVELOPMENT - to be released fully functional any minute now :)**

[![Build Status](https://travis-ci.org/pghalliday/alarmist.svg?branch=master)](https://travis-ci.org/pghalliday/alarmist)
[![Coverage Status](https://coveralls.io/repos/github/pghalliday/alarmist/badge.svg?branch=master)](https://coveralls.io/github/pghalliday/alarmist?branch=master)

Monitor parallel jobs

## Install

```
npm install --save-dev alarmist
```

## CLI

Execute a job

```
alarmist-job -n name -c my-command
```

Monitor jobs

```
alarmist-monitor -c my-watch-command
```

## API

```javascript
var alarmist = require('alarmist');
```

### Custom jobs

Create a job.

```javascript
alarmist.createJob({
  name: 'name'
}).then(function(job) {
  ...
});
```

The job will expose `stdout` and `stdin` write streams that you can use for logging.

```javascript
job.stdout.write('this gets recorded as stdout');
job.stderr.write('this gets recorded as stderr');
```

When the job is complete call the `complete` method to signal success or failure with an exit code.

```javascript
job.complete({
  exitCode: 0
}).then(function() {
  ...
});
```

### Execute a job

```javascript
alarmist.execJob({
  name: 'name',
  command: 'my-command'
}).then(function() {
  ...
});
```

## Monitor jobs and execute a watcher

Start a monitor and watcher process

```javascript
alarmist.execMonitor({
  command: 'my-watcher-command'
})
.then(function(monitor) {
  ...
});
```

Listen for start events

```javascript
monitor.on('start', function(job) {
  console.log(job.id);
  console.log(job.name);
  console.log(job.startTime);
});
```

Listen for complete events

```javascript
monitor.on('complete', function(job) {
  console.log(job.id);
  console.log(job.name);
  console.log(job.startTime);
  console.log(job.endTime);
  console.log(job.exitCode);
  console.log(job.stdout);
  console.log(job.stderr);
  console.log(job.all);
});
```

Listen for an `exit` event that signifies an error as the watcher process should not exit

```javascript
monitor.on('exit', function(code) {
  console.log(code);
});
```

Stop a monitor

```javascript
monitor.close();
```

### Monitor jobs with your own watcher

Start a monitor

```javascript
alarmist.createMonitor()
.then(function(monitor) {
  // create and manage your watcher
  ...
});
```

Listen for job events as above

Log stdout and stderr for your watcher process

```javascript
monitor.stdout.write('output');
monitor.stderr.write('error');
```

Signal the exit of the watcher process (watcher processes aren't meant to exit so this is really signalling an error)

```javascript
// provide an exit code
monitor.exit(1);
```

Listen for exit events and close the monitor as above

## Contributing

Run tests, etc before pushing changes/opening a PR

- `npm test` - lint and test
- `npm run build` - run tests then build
- `npm run watch` - watch for changes and run build
- `npm run ci` - run build and submit coverage to coveralls
