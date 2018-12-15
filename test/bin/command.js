const constants = require('../helpers/constants');
const appconstants = require('../../src/constants');
const fs = require('fs');
process.stdout.write(process.argv[2]);
process.stderr.write(process.argv[3]);
fs.writeFileSync(
    `${constants.WORKING_DIR}/${appconstants.WORKING_DIRECTORY_VAR}`,
    process.env[appconstants.WORKING_DIRECTORY_VAR]
);
fs.writeFileSync(
    `${constants.WORKING_DIR}/${appconstants.FORCE_COLOR_VAR}`,
    process.env[appconstants.FORCE_COLOR_VAR]
);
setTimeout(() => {
  process.exit(parseInt(process.argv[4]));
}, 1000);
