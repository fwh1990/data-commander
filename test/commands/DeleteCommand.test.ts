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

  expect(command.execute({ '2': 'cc' })).toMatchObject({
    migrate: expect.arrayContaining([
      <DataSchema>{
        type: 'delete',
        paths: ['2'],
        value: null,
      },
    ]),
    revert: expect.arrayContaining([
      <DataSchema>{
        type: 'set',
        paths: ['2'],
        value: 'cc',
      },
    ]),
  });

  expect(command.execute(['aa', 'bb', 'cc'])).toMatchObject({
    migrate: expect.arrayContaining([
      <DataSchema>{
        type: 'delete',
        paths: ['2'],
        value: null,
      },
    ]),
    revert: expect.arrayContaining([
      <DataSchema>{
        type: 'insert',
        paths: ['2'],
        value: 'cc',
      },
    ]),
  });
});

it('will not generate command when property is not found', () => {
  const command = new DeleteCommand(['2']);

  expect(command.execute({ '1': 'cc' }).migrate).toHaveLength(0);
  expect(command.execute({ '1': 'cc' }).revert).toHaveLength(0);

  expect(command.execute(['aa', 'bb']).migrate).toHaveLength(0);
  expect(command.execute(['aa', 'bb']).revert).toHaveLength(0);
});
