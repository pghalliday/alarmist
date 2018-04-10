import task from '../../../../../../../src/cli/monitor/ui/types/task';

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('types', () => {
        describe('task', () => {
          it('should expose the createView function', () => {
            task.createView.should.be.a('function');
          });
          it('should expose the createReducer function', () => {
            task.createReducer.should.be.a('function');
          });
          it('should expose the createService function', () => {
            task.createService.should.be.a('function');
          });
        });
      });
    });
  });
});
