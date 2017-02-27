#!/usr/bin/env node
require('babel-polyfill');
require('../lib/cli/job.js')(process.argv.slice(2));
