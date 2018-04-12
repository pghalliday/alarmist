import Entries from '../../../../../../src/cli/monitor/ui/view/entries';

let entries;
const layout = {
  append: sinon.spy(),
};
let entry;
let lastEntry;
class Type {
  constructor(name) {
    this.update = sinon.spy();
    this.name = name;
    entry = this;
  }
}
const types = {
  type: {
    createView: (name) => {
      return new Type(name);
    },
  },
};

const type = 'type';
const name = 'name';
const anotherName = 'anotherName';

const status = {
  type,
  name,
};
const anotherStatus = {
  type,
  name: anotherName,
};
const updatedStatus = {
  type,
  name: anotherName,
};

const newEntry = {
  [name]: status,
};
const anotherNewEntry = {
  [name]: status,
  [anotherName]: anotherStatus,
};
const updatedEntry = {
  [name]: status,
  [anotherName]: updatedStatus,
};

describe('cli', () => {
  describe('monitor', () => {
    describe('ui', () => {
      describe('view', () => {
        describe('Entries', () => {
          describe('update', () => {
            describe('with a new entry', () => {
              before(() => {
                entries = new Entries({
                  types,
                  layout,
                });
                layout.append.reset();
                entry = undefined;
                entries.update(newEntry);
              });

              it('should create a new entry', () => {
                entry.should.be.an.instanceOf(Type);
                entry.name.should.eql(name);
              });

              it('should append the entry to the layout', () => {
                layout.append.should.have.been.calledWith(
                  name,
                  entry,
                );
              });

              describe('then with another new entry', () => {
                before(() => {
                  layout.append.reset();
                  entry = undefined;
                  entries.update(anotherNewEntry);
                });

                it('should create a new entry', () => {
                  entry.should.be.an.instanceOf(Type);
                  entry.name.should.eql(anotherName);
                });

                it('should append the entry to the layout', () => {
                  layout.append.should.have.been.calledWith(
                    anotherName,
                    entry,
                  );
                });

                describe('then with an updated entry', () => {
                  before(() => {
                    layout.append.reset();
                    entry.update.reset();
                    lastEntry = entry;
                    entry = undefined;
                    entries.update(updatedEntry);
                  });

                  it('should not create a new entry', () => {
                    expect(entry).to.not.be.ok;
                  });

                  it('should not append the entry to the layout', () => {
                    layout.append.should.not.have.been.called;
                  });

                  it('should update the entry', () => {
                    lastEntry.update.should.have.been.calledOnce;
                    lastEntry.update.should.have.been.calledWith(
                      sinon.match.same(updatedStatus)
                    );
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
