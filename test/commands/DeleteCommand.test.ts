import { DeleteCommand, DataSchema } from '../../src';

it('delete object property', () => {
  const data = {
    test: 1,
    test1: {
      hello: 'world',
    },
  };

  let command = new DeleteCommand(['test']);
  expect(data.hasOwnProperty('test')).toBeTruthy();
  command.execute(data);
  expect(data.hasOwnProperty('test')).toBeFalsy();

  command = new DeleteCommand(['test1', 'hello']);
  expect(data.test1.hasOwnProperty('hello')).toBeTruthy();
  command.execute(data);
  expect(data.test1.hasOwnProperty('hello')).toBeFalsy();

  command = new DeleteCommand(['not-exist']);
  command.execute(data);
  expect(data.hasOwnProperty('not-exist')).toBeFalsy();
});

it('delete array item', () => {
  const data = ['a', 'b', 'c'];

  const command = new DeleteCommand(['1']);
  expect(data[1]).toEqual('b');
  command.execute(data);
  expect(data[1]).toEqual('c');
  expect(data).toHaveLength(2);
});

it('can create migrate command', () => {
  const command = new DeleteCommand(['2']);

  expect(command.getMigrateCommand({ '2': 'cc' })).toEqual(
    expect.arrayContaining([
      <DataSchema>{
        type: 'delete',
        paths: ['2'],
        value: null,
      },
    ]),
  );
  expect(command.getRevertCommand({ '2': 'cc' })).toEqual(
    expect.arrayContaining([
      <DataSchema>{
        type: 'set',
        paths: ['2'],
        value: 'cc',
      },
    ]),
  );

  expect(command.getMigrateCommand(['aa', 'bb', 'cc'])).toEqual(
    expect.arrayContaining([
      <DataSchema>{
        type: 'delete',
        paths: ['2'],
        value: null,
      },
    ]),
  );
  expect(command.getRevertCommand(['aa', 'bb', 'cc'])).toEqual(
    expect.arrayContaining([
      <DataSchema>{
        type: 'insert',
        paths: ['2'],
        value: 'cc',
      },
    ]),
  );
});

it('will not generate command when property is not found', () => {
  const command = new DeleteCommand(['2']);

  expect(command.getMigrateCommand({ '1': 'cc' })).toHaveLength(0);
  expect(command.getRevertCommand({ '1': 'cc' })).toHaveLength(0);

  expect(command.getMigrateCommand(['aa', 'bb'])).toHaveLength(0);
  expect(command.getRevertCommand(['aa', 'bb'])).toHaveLength(0);
});
