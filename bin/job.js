#!/usr/bin/env node
require('babel-polyfill');
require('../lib/cli/job')(process.argv.slice(2));
