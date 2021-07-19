import { DeleteCommand, SchemaItem } from '../../src';

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
    up: expect.arrayContaining([
      <SchemaItem>{
        type: 'delete',
        path: ['2'],
        data: null,
      },
    ]),
    down: expect.arrayContaining([
      <SchemaItem>{
        type: 'set',
        path: ['2'],
        data: 'cc',
      },
    ]),
  });

  expect(command.execute(['aa', 'bb', 'cc'])).toMatchObject({
    up: expect.arrayContaining([
      <SchemaItem>{
        type: 'delete',
        path: ['2'],
        data: null,
      },
    ]),
    down: expect.arrayContaining([
      <SchemaItem>{
        type: 'insert',
        path: ['2'],
        data: 'cc',
      },
    ]),
  });
});

it('will not generate command when property is not found', () => {
  const command = new DeleteCommand(['2']);

  expect(command.execute({ '1': 'cc' }).up).toHaveLength(0);
  expect(command.execute({ '1': 'cc' }).down).toHaveLength(0);

  expect(command.execute(['aa', 'bb']).up).toHaveLength(0);
  expect(command.execute(['aa', 'bb']).down).toHaveLength(0);
});
