<h1>
<div style="align-items:center">
<img height="35" src="https://raw.githubusercontent.com/pghalliday/alarmist/master/light.png"/>
<span>The Alarmist</span>
</div>
</h1>

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

Monitor jobs

```
Usage: alarmist-monitor [options] <command> [<arg>...]

Start monitoring jobs. If multiple monitors need to be run
in the same directory then use the '--working-dir' option
or export the 'ALARMIST_WORKING_DIRECTORY' variable to keep
them separated. This will also export the
'ALARMIST_WORKING_DIRECTORY' environment variable for use by
jobs started by the watcher tasks.

Environment Variables:

FORCE_COLOR
ALARMIST_WORKING_DIRECTORY
ALARMIST_RESET

<command>: The command to start the watcher tasks
<arg>: arguments for the command

Options:
    --working-dir, -w     The directory in which to write logs, etc (default: ".alarmist")
    --reset, -r           Reset the working directory on start (default: true)
    --force-color, -c     Set the FORCE_COLOR environment variable for watchers and jobs (default: true)
    --help, -h            Show help
    --version, -v         Show version number
```

Execute a job

```
Usage: alarmist-job [options] <name> <command> [<arg>...]

Start a job. The working directory should match the
working directory of the monitor and usually this will
be the default. If the job is started via a watcher started
by the monitor then the 'ALARMIST_WORKING_DIRECTORY' environment
variable will have already been set.

A job can also be flagged as a service. Services are processes
that are not supposed to exit. As such they will be shown as OK
as long as they are running and error if they exit. The main
use case is to capture the logs from a long running process, such
as a web server, separately.

<name>: The name of the job
<command>: The command to start the job
<arg>: arguments for the command

Environment Variables:

FORCE_COLOR
ALARMIST_WORKING_DIRECTORY
ALARMIST_SERVICE

Options:
    --working-dir, -w     The directory in which to write logs, etc (default: ".alarmist")
    --service, -s         Flag the job as a service (default: false)
    --force-color, -c     Set the FORCE_COLOR environment variable for the job (default: true)
    --help, -h            Show help
    --version, -v         Show version number
```

Jobs will appear on first run and can be expanded (one at a time) to display logs

- [CTRL-c] - stop the monitor
- [up, down, j, k, SHIFT-j, SHIFT-k] -  select a job
- [enter, o] - expand/collapse job logs
  - [up, down, j, k, g, SHIFT-g, CTRL-u, CTRL-d, CTRL-f, CTRL-b] - navigate log when expanded (vi keys)
  - [y] - copy complete log to clipboard without control sequences (no colors)
  - [SHIFT-y] - copy complete log to clipboard with control sequences (colors)
  - [SHIFT-j, SHIFT-k] - expand next or previous job

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

**NB. The `.alarmist` working directory will be reset every time the monitor is started by default. See the `--reset` option**

## Helpers

The following packages provide helpers and can be installed with npm.

- [`alarmist-npm`](https://www.npmjs.com/package/alarmist-npm) - a simple wrapper for running npm scripts
- [`alarmist-webpack`](https://www.npmjs.com/package/alarmist-webpack) - a wrapper for the webpack watcher to take advantage of fast incremental builds

## Example `package.json` configuration

This will use `chokidar` for watching and the `npm-run-all` package to parallelize the watcher tasks.

```
npm install --save-dev chokidar npm-run-all webpack alarmist alarmist-npm alarmist-webpack
```

Then to watch parallel eslint, nyc/mocha and webpack jobs, etc (other configuration not shown here)

```javascript
...
  "scripts": {
    "cmd:lint": "eslint .",
    "cmd:test": "nyc mocha",
    "cmd:coverage": "nyc report -r text && nyc check-coverage",
    "cmd:serve": "http-server build",
    "alarmist:lint": "chokidar \"+(src|test)/**/*\" -c \"alarmist-npm cmd:lint\"",
    "alarmist:test": "chokidar \"+(src|test)/**/*\" -c \"alarmist-npm cmd:test\"",
    "alarmist:coverage": "chokidar \"coverage/lcov.info\" -c \"alarmist-npm cmd:coverage\"",
    "alarmist:build": "alarmist-webpack -n cmd:build",
    "alarmist:serve": "alarmist-npm --service cmd:serve",
    "start": "alarmist-monitor run-p alarmist:lint alarmist:test alarmist:coverage alarmist:build alarmist:serve",
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
