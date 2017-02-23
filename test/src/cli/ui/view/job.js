import blessed from 'blessed';
import {createJob} from '../../../../../src/cli/ui/view/job';
import {
  TEXT_PROPERTIES,
} from '../../../../../src/cli/ui/view/constants';

let job;

const element = {style: {}};
const text = sinon.spy(() => element);
const layout = {
  append: sinon.spy(),
};

describe('cli', () => {
  describe('ui', () => {
    describe('view', () => {
      describe('job', () => {
        before(() => {
          const fnText = blessed.text;
          text.reset();
          blessed.text = text;
          job = createJob(layout);
          blessed.text = fnText;
        });

        it('should construct a text element', () => {
          text.should.have.been.calledWith(TEXT_PROPERTIES);
        });

        it('should append the element to the layout', () => {
          layout.append.should.have.been.calledWith(
            sinon.match.same(element)
          );
        });

        describe('update', () => {
          describe('without an exit code', () => {
            before(() => {
              job.update({
                name: 'name',
                id: 'id',
              });
            });

            it('should go yellow', () => {
              element.style.bg.should.eql('yellow');
            });

            it('should display the name, id and pending', () => {
              element.content.should.eql(' name: id: pending');
            });
          });

          describe('without a zero exit code', () => {
            before(() => {
              job.update({
                name: 'name',
                id: 'id',
                exitCode: 0,
              });
            });

            it('should go green', () => {
              element.style.bg.should.eql('green');
            });

            it('should display the name, id and exit code', () => {
              element.content.should.eql(' name: id: 0');
            });
          });

          describe('with a non-zero exit code', () => {
            before(() => {
              job.update({
                name: 'name',
                id: 'id',
                exitCode: 1,
              });
            });

            it('should go red', () => {
              element.style.bg.should.eql('red');
            });

            it('should display the name, id and exit code', () => {
              element.content.should.eql(' name: id: 1');
            });
          });
        });
      });
    });
  });
});
