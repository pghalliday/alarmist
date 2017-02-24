// eslint-disable-next-line no-var
var fs = require('fs');
process.stdout.write(process.argv[2]);
process.stderr.write(process.argv[3]);
fs.closeSync(fs.openSync('.alarmist-test/done', 'w'));
setInterval(function() {
  // do nothing
}, 1000);
