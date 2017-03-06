import sinon from 'sinon';
import logger from '../../src/cli/monitor/ui/view/logger';
logger.log = sinon.spy();
logger.debug = sinon.spy();
