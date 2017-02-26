import sinon from 'sinon';
import logger from '../../src/cli/ui/view/logger';
logger.log = sinon.spy();
logger.debug = sinon.spy();
