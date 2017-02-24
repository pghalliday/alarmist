// assertions
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);
global.expect = chai.expect;
global.sinon = sinon;

// override the working directory for tests
import constants from '../../src/constants';
constants.WORKING_DIR = '.alarmist-test';
