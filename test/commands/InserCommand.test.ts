import { InsertCommand, DataSchema } from '../../src';

it('can insert array item', () => {
  const data = {
    test: ['a', 'b'],
  };

  const command = new InsertCommand(['test', '2'], 'cc');

  command.execute(data);
  expect(data.test).toHaveLength(3);
  expect(data.test[2]).toBe('cc');

  command.execute(data);
  expect(data.test).toHaveLength(4);
  expect(data.test[2]).toBe('cc');

  command.execute(data);
  expect(data.test).toHaveLength(5);
  expect(data.test[2]).toBe('cc');
});

it('the execute data must be array type', () => {
  const data = {};
  const command = new InsertCommand(['2'], 'cc');

  expect(() => command.execute(data)).toThrowError();
});

it('the last key should be number', () => {
  const data: string[] = [];
  const command = new InsertCommand(['not-number'], 'cc');

  expect(() => command.execute(data)).toThrowError();
});

it('can create migrate command', () => {
  const command = new InsertCommand(['2'], 'cc');

  expect(command.getMigrateCommand(['aa', 'bb', 'cc'])).toEqual(
    expect.arrayContaining([
      <DataSchema>{
        type: 'insert',
        paths: ['2'],
        value: 'cc',
      },
    ]),
  );

  expect(command.getRevertCommand(['aa', 'bb', 'cc'])).toEqual(
    expect.arrayContaining([
      <DataSchema>{
        type: 'delete',
        paths: ['2'],
        value: null,
      },
    ]),
  );
});
