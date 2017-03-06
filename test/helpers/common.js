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

// override the blessed functions
import './blessed';

// override the copy-paste functions
import './copy-paste';

// override logger functions
import './logger';
