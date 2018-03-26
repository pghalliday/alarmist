import _ from 'lodash';
import helper from '../../../../../helpers/blessed';
import blessed from 'blessed';
import Table from '../../../../../../src/cli/monitor/ui/view/table';
import Entry from '../../../../../../src/cli/monitor/ui/view/entry';
import {
  TABLE_PROPERTIES,
} from '../../../../../../src/cli/monitor/ui/view/constants';

let table;
const container = {
  append: sinon.spy(),
};

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('view', () => {
        describe('Table', () => {
          before(() => {
            blessed.text.reset();
            blessed.table.reset();
            table = new Table();
            sinon.spy(table, 'setHeader');
          });

          it('should be an Entry', () => {
            table.should.be.an.instanceOf(Entry);
          });

          it('should construct the table', () => {
            blessed.table.should.have.been.calledWith(TABLE_PROPERTIES);
          });

          it('should hide the table', () => {
            helper.table.hide.should.have.been.calledOnce;
          });

          it('should clear the table', () => {
            helper.table.setData.should.have.been.calledWith([]);
          });

          describe('_setContentParent', () => {
            before(() => {
              container.append.reset();
              table._setContentParent(container);
            });

            it('should append the table', () => {
              container.append.should.have.been.calledWith(helper.table);
            });
          });

          describe('_update', () => {
          });

          describe('clear', () => {
            before(() => {
              helper.reset();
              table.clear();
            });

            it('should clear the table', () => {
              helper.table.setData.should.have.been.calledWith([]);
            });
          });

          describe('setContentHeight', () => {
            before(() => {
              helper.reset();
              table.setContentHeight(10);
            });

            it('should set the table height', () => {
              helper.table.height.should.eql(10);
            });
          });

          describe('_setContentTop', () => {
            before(() => {
              helper.reset();
              table._setContentTop(10);
            });

            it('should set the table top', () => {
              helper.table.top.should.eql(10);
            });
          });

          describe('expand', () => {
            before(() => {
              helper.reset();
              helper.lines = [];
              table.expand();
            });

            it('should show the table', () => {
              helper.table.show.should.have.been.calledOnce;
            });

            describe('then expand again', () => {
              before(() => {
                helper.reset();
                table.expand();
              });

              it('should do nothing', () => {
                helper.table.show.should.not.have.been.called;
              });
            });

            describe('then collapse', () => {
              before(() => {
                helper.reset();
                table.collapse();
              });

              it('should hide the table', () => {
                helper.table.hide.should.have.been.calledOnce;
              });

              describe('then collapse again', () => {
                before(() => {
                  helper.reset();
                  table.collapse();
                });

                it('should do nothing', () => {
                  helper.table.hide.should.not.have.been.called;
                });
              });
            });
          });

          describe('focus', () => {
            before(() => {
              helper.reset();
              table.focus();
            });

            it('should focus the table', () => {
              helper.table.focus.should.have.been.calledOnce;
            });
          });
        });
      });
    });
  });
});
