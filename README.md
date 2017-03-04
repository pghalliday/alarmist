# The Alarmist

[![Build Status](https://travis-ci.org/pghalliday/alarmist.svg?branch=master)](https://travis-ci.org/pghalliday/alarmist)
[![Build status](https://ci.appveyor.com/api/projects/status/w4tcbmqhghndynob/branch/master?svg=true)](https://ci.appveyor.com/project/pghalliday/alarmist/branch/master)
[![Coverage Status](https://coveralls.io/repos/github/pghalliday/alarmist/badge.svg?branch=master)](https://coveralls.io/github/pghalliday/alarmist?branch=master)

![alt Alarmist UI](https://raw.githubusercontent.com/pghalliday/alarmist/master/alarmist.png "Alarmist UI")

- Tired of fixing lint errors so you can see if your unit tests pass?
- Tired of fixing all your tests only to find the linting's up the spout?
- Tired of waiting for everything to pass before your build completes and you can actually see if stuff works?
- Tired of your watch tasks just taking too long to complete?

Well this is the tool for you! ...at least if you like to live in the terminal :)

You no longer have to make the choice between starting lots of watcher terminals or jumbling up all your watcher jobs in one.

Alarmist will start everything in parallel (when it can) and provide a clean interface highlighting failures but allowing you to focus on the particular tests you're interested in at the moment.

Enabling you to experiment with a new feature or get down and dirty debugging a failing test without being unduly distracted by failures you don't care about right now!

## Install

```
npm install --save-dev alarmist
```

## CLI

Execute a job

```
alarmist-job -n name my-command [args...]
```

Monitor jobs

```
alarmist-monitor my-watch-command [args...]
```

Jobs will appear on first run and can be expanded (one at a time) to display logs

- [CTRL-c] - stop the monitor
- [up, down, j, k] -  select a job
- [enter, o] - expand/collapse job logs
  - [up, down, j, k, g, SHIFT-g] - navigate log when expanded

**NB. By default many commands will not produce colored output when run like this, however many commands also have options to force colors. Eg. many node CLI tools use the `chalk` library and so will have a `--color` option or support the `FORCE_COLOR=true` environment variable**

All the logs and status files will also be captured in the `.alarmist` working directory with the following structure

```
.
└── .alarmist/
    ├── ui.log - internal UI logging for debug purposes
    ├── monitor.log - the monitor command's log
    ├── control.sock - unix socket or windows named pipe information that jobs use to notify the monitor on status change
    ├── log.sock - unix socket or windows named pipe information that jobs use to pipe logs to the monitor
    └── jobs/
      └── [name]
          ├── last-run - the last run number
          └── [run number]/
              ├── run.log - the job run's log
              └── status.json - the job run's status
```

**NB. The `.alarmist` working directory will be reset every time the monitor is started**

## Helpers

The following packages provide helpers and can be installed with npm.

- [`alarmist-npm`](https://www.npmjs.com/package/alarmist-npm) - a simple wrapper for running npm scripts
- [`alarmist-webpack`](https://www.npmjs.com/package/alarmist-webpack) - a wrapper for the webpack watcher to take advantage of fast incremental builds

## Example `package.json` configuration

This will use `chokidar` for watching and the `npm-run-all` package to parallelize the watcher tasks.

```
npm install --save-dev chokidar npm-run-all webpack alarmist alarmist-npm alarmist-webpack
```

Then to watch parallel eslint, nyc/mocha and webpack jobs (other configuration not shown here)

```javascript
...
  "scripts": {
    "cmd:lint": "eslint .",
    "cmd:test": "nyc mocha",
    "cmd:coverage": "nyc report -r text && nyc check-coverage",
    "alarmist:lint": "chokidar \"+(src|test)/**/*\" -c \"alarmist-npm cmd:lint\"",
    "alarmist:test": "chokidar \"+(src|test)/**/*\" -c \"alarmist-npm cmd:test\"",
    "alarmist:coverage": "chokidar \"coverage/lcov.info\" -c \"alarmist-npm cmd:coverage\"",
    "alarmist:build": "alarmist-webpack -n cmd:build",
    "start": "alarmist-monitor run-p alarmist:lint alarmist:test alarmist:coverage alarmist:build",
    ...
  }
...
```

## API

Create your own custom watchers, jobs, etc using the [NodeJS API](./API.md)

## Contributing

Run tests, etc before pushing changes/opening a PR

- `npm test` - lint and test
- `npm run build` - run tests then build
- `npm run watch` - watch for changes and run build
- `npm run ci` - run build and submit coverage to coveralls
- `npm start` - use alarmist to monitor its own build tasks in parallel :)
