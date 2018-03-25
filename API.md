# API

```javascript
var alarmist = require('alarmist');
```

## Custom jobs

Create a job.

```javascript
alarmist.createJob({
  name: 'name',
  workingDirectory: '.alarmist',
  service: false,
  metric: false,
})]
.then(function(job) {
  ...
});
```

The job will expose a `log` write stream that you can use for logging.

```javascript
job.log.write('this gets logged');
```

When the job is complete call the `end` method and optionally signal failure with an error message (should be string)

```javascript
job.end(error)
.then(function() {
  ...
});
```

## Execute a job

```javascript
alarmist.execJob({
  name: 'name',
  command: 'my-command',
  args: [],
  workingDirectory: '.alarmist',
  service: false,
  metric: false,
  color: true
}).then(function() {
  ...
});
```

## Monitor jobs and execute a watcher

Start a monitor and watcher process

```javascript
alarmist.execMonitor({
  command: 'my-watcher-command',
  args: [],
  workingDirectory: '.alarmist',
  color: true,
  reset: true
})
.then(function(monitor) {
  ...
});
```

Listen for start events when jobs start

```javascript
monitor.on('run-start', function(job) {
  console.log(job.id);
  console.log(job.name);
  console.log(job.startTime);
});
```

Listen for log events when jobs log data

```javascript
monitor.on('run-log', function(job) {
  console.log(job.id);
  console.log(job.name);
  console.log(job.data); // this should be a Buffer
});
```

Listen for end events when jobs end

```javascript
monitor.on('run-end', function(job) {
  console.log(job.id);
  console.log(job.name);
  console.log(job.startTime);
  console.log(job.endTime);
  console.log(job.error);
});
```

Read from the monitor log stream, for logging from the watcher command

```javascript
monitor.log.on('data', function(data) {
  console.log(data) // this shoud be a Buffer
});
```

Listen for an `end` event that signifies an error as the watcher process should not exit

```javascript
monitor.on('end', function(error) {
  console.log(error);
});
```

Stop a monitor

```javascript
monitor.close();
```

## Monitor jobs with your own watcher

Start a monitor

```javascript
alarmist.createMonitor({
  workingDirectory: '.alarmist',
  reset: true
})
.then(function(monitor) {
  // create and manage your watcher
  ...
});
```

Listen for job events as above

Log for your watcher process

```javascript
monitor.log.write('output');
```

Signal the end of the watcher routine (watcher routines aren't meant to end so this is really signalling an error)

```javascript
// provide an error string
monitor.end(error);
```

Listen for end events and close the monitor as above
