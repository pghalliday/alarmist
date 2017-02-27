#!/usr/bin/env node
require('babel-polyfill');
require('../lib/cli/monitor.js')(process.argv.slice(2));
