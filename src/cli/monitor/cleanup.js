class Cleanup {
  constructor() {
    this.callbacks = [];
    // istanbul ignore next
    process.on('uncaughtException', async (error) => {
      await this.end();
      console.error(error.stack);
      process.exit(1);
    });
  }

  // istanbul ignore next
  async end() {
    while (this.callbacks.length) {
      await this.callbacks.pop()();
    }
  }

  register(callback) {
    this.callbacks.push(callback);
  }
}
const cleanup = new Cleanup();
export default cleanup;
