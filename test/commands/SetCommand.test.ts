import { SetCommand, SchemaItem } from '../../src';

/**
 * Test for base class
 */
it('can get paths', () => {
  const paths = ['test', 'test1'];
  const command = new SetCommand(paths, 2);

  expect(command.getPaths()).toEqual(paths);
  expect(command.getPaths().toString()).toEqual(paths.toString());
});

it('set basic value', () => {
  const data1: Record<string, any> = {};
  const data2 = { test: '2' };
  const data3 = { test: 2 };

  const command = new SetCommand(['test'], 2);

  command.execute(data1);
  expect(data1['test']).toEqual(2);

  command.execute(data2);
  expect(data2.test).toEqual(2);

  command.execute(data3);
  expect(data3.test).toEqual(2);
});

it('set object', () => {
  const data1: Record<string, any> = {};
  const setValue = {};

  const command = new SetCommand(['test'], setValue);

  command.execute(data1);
  expect(data1['test']).toEqual(setValue);
});

it('does not override same object', () => {
  const target = {
    hello: {
      hi: 'world',
    },
  };
  const data1 = { test: target };

  new SetCommand(['test'], {
    hello: {
      hi: 'world',
    },
  }).execute(data1);
  expect(data1.test).toEqual(target);

  const different = {
    hello: {
      hi: 'world-1',
    },
  };
  new SetCommand(['test'], different).execute(data1);
  expect(data1.test).not.toEqual(target);
  expect(data1.test).toEqual(different);
});

it('can create migrate command', () => {
  const command = new SetCommand(['test', 'test1'], 'x');

  expect(command.execute({ test: { test1: 'y' } })).toMatchObject({
    up: expect.arrayContaining([
      <SchemaItem>{
        type: 'set',
        path: ['test', 'test1'],
        data: 'x',
      },
    ]),
    down: expect.arrayContaining([
      <SchemaItem>{
        type: 'set',
        path: ['test', 'test1'],
        data: 'y',
      },
    ]),
  });

  expect(command.execute({ test: {} })).toMatchObject({
    up: expect.arrayContaining([
      <SchemaItem>{
        type: 'set',
        path: ['test', 'test1'],
        data: 'x',
      },
    ]),
    down: expect.arrayContaining([
      <SchemaItem>{
        type: 'delete',
        path: ['test', 'test1'],
        data: null,
      },
    ]),
  });
});

it('Migrate command will not generate with same value', () => {
  let command = new SetCommand(['test', 'test1'], 'x');

  expect(command.execute({ test: { test1: 'x' } }).up).toHaveLength(0);
  expect(command.execute({ test: { test1: 'x' } }).down).toHaveLength(0);

  command = new SetCommand(['test', 'test1'], ['a', 'b', 'c']);
  expect(command.execute({ test: { test1: ['a', 'b', 'c'] } }).up).toHaveLength(
    0,
  );
  expect(
    command.execute({ test: { test1: ['a', 'b', 'c'] } }).down,
  ).toHaveLength(0);
});
