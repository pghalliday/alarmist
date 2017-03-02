process.stdout.write(process.argv[2]);
process.stderr.write(process.argv[3]);
setTimeout(() => {
  process.exit(parseInt(process.argv[4]));
}, 1000);
