import service from '../../../../../../../src/cli/monitor/ui/types/service';

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('types', () => {
        describe('service', () => {
          it('should expose the createView function', () => {
            service.createView.should.be.a('function');
          });
          it('should expose the createReducer function', () => {
            service.createReducer.should.be.a('function');
          });
          it('should expose the createService function', () => {
            service.createService.should.be.a('function');
          });
        });
      });
    });
  });
});
