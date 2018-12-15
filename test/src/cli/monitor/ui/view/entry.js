import _ from 'lodash';
import helper from '../../../../../helpers/blessed';
import blessed from 'blessed';
import Entry from '../../../../../../src/cli/monitor/ui/view/entry';
import {
  HEADER_PROPERTIES,
} from '../../../../../../src/cli/monitor/ui/view/constants';

let entry;
const state = {};
const container = {
  append: sinon.spy(),
};

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('view', () => {
        describe('Entry', () => {
          before(() => {
            blessed.text.resetHistory();
            entry = new Entry();
            sinon.spy(entry, '_update');
            sinon.spy(entry, 'setContentHeight');
            sinon.spy(entry, '_setContentTop');
            sinon.spy(entry, 'expand');
            sinon.spy(entry, 'collapse');
            sinon.spy(entry, 'focus');
          });

          it('should construct the header', () => {
            blessed.text.should.have.been.calledWith(HEADER_PROPERTIES);
          });

          describe('when the header is clicked', () => {
            it('should emit a select event', (done) => {
              entry.on('select', done);
              helper.text.click();
            });
          });

          describe('setParent', () => {
            before(() => {
              container.append.resetHistory();
              entry.setParent(container);
            });

            it('should append the header', () => {
              container.append.should.have.been.calledWith(helper.text);
            });
          });

          describe('update', () => {
            before(() => {
              entry._update.resetHistory();
              entry.update(state);
            });

            it('should update the state', () => {
              entry._update.should.have.been.calledWith(state);
            });

            describe('with the same state', () => {
              before(() => {
                entry._update.resetHistory();
                entry.update(state);
              });

              it('should not update the state', () => {
                entry._update.should.not.have.been.called;
              });
            });
          });

          describe('setHeader', () => {
            before(() => {
              helper.reset();
              entry.setHeader('content', 'color');
            });

            it('should set the header content', () => {
              helper.text.setContent.should.have.been.calledWith('content');
            });

            it('should set the header color', () => {
              helper.text.style.bg.should.eql('color');
            });
          });

          describe('getHeaderHeight', () => {
            it('should return the header height', () => {
              entry.getHeaderHeight().should.eql(HEADER_PROPERTIES.height);
            });
          });

          describe('setContentHeight', () => {
            before(() => {
              entry.setContentHeight.resetHistory();
              entry.setContentHeight(10);
            });

            it('should set the content height', () => {
              entry.setContentHeight.should.have.been.calledWith(10);
            });
          });

          describe('setTop', () => {
            before(() => {
              helper.reset();
              entry._setContentTop.resetHistory();
              entry.setTop(10);
            });

            it('should set the header top', () => {
              helper.text.top.should.eql(10);
            });

            it('should set the content top', () => {
              entry._setContentTop.should.have.been.calledWith(
                  10 + entry.getHeaderHeight()
              );
            });
          });

          describe('expand', () => {
            before(() => {
              entry.expand.resetHistory();
              entry.expand();
            });

            it('should expand', () => {
              entry.expand.should.have.been.calledOnce;
            });
          });

          describe('then collapse', () => {
            before(() => {
              entry.collapse.resetHistory();
              entry.collapse();
            });

            it('should hide the entry', () => {
              entry.collapse.should.have.been.calledOnce;
            });
          });

          describe('focus', () => {
            before(() => {
              entry.focus();
            });

            it('should focus the entry', () => {
              entry.focus.should.have.been.calledOnce;
            });
          });
        });
      });
    });
  });
});
