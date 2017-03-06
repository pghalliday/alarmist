#!/usr/bin/env node
require('babel-polyfill');
require('../lib/cli/monitor')(process.argv.slice(2));
