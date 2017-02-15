import * as alarmist from '../../src';
describe('alarmist', () => {
  it('should export createJob', () => {
    alarmist.createJob.should.be.ok;
  });
  it('should export createMonitor', () => {
    alarmist.createMonitor.should.be.ok;
  });
  it('should export execJob', () => {
    alarmist.execJob.should.be.ok;
  });
  it('should export execMonitor', () => {
    alarmist.execMonitor.should.be.ok;
  });
});
