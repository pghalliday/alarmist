import {
  createUi,
} from '../../../src/cli/ui';
import EventEmitter from 'events';
import {
  capture,
  restore,
  flush,
} from '../../helpers/stdout';

const monitor = new EventEmitter();
const id = 'id';
const name = 'name';
const startTime = 1000000;
const endTime = 2000000;
const exitCode = 0;
const stdout = 'stdout';
const stderr = 'stderr';
const all = stdout + stderr;

describe('cli', () => {
  describe('ui', () => {
    describe('createUi', () => {
      before(() => {
        createUi(monitor);
      });

      beforeEach(() => {
        capture();
      });

      afterEach(() => {
        restore();
      });

      it('should report job starts', () => {
        monitor.emit('start', {
          id,
          name,
          startTime,
        });
        flush().should.eql(
          Buffer.from(`${name}: ${id}: started: ${startTime}\n`)
        );
      });

      it('should report job completes', () => {
        monitor.emit('complete', {
          id,
          name,
          startTime,
          endTime,
          exitCode,
          stdout,
          stderr,
          all,
        });
        flush().should.eql(
          Buffer.from(
            `${all}\n${name}: ${id}: completed: ${endTime}: ${exitCode}\n`
          )
        );
      });
    });
  });
});
