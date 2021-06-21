import { SetCommand, DataSchema } from '../../src';

/**
 * Test for base class
 */
it('can get paths', () => {
  const paths: [string, ...string[]] = ['test', 'test1'];
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

  expect(command.getMigrateCommand({ test: { test1: 'y' } })).toEqual(
    expect.arrayContaining([
      <DataSchema>{
        type: 'set',
        paths: ['test', 'test1'],
        value: 'x',
      },
    ]),
  );
  expect(command.getRevertCommand({ test: { test1: 'y' } })).toEqual(
    expect.arrayContaining([
      <DataSchema>{
        type: 'set',
        paths: ['test', 'test1'],
        value: 'y',
      },
    ]),
  );

  expect(command.getRevertCommand({ test: {} })).toEqual(
    expect.arrayContaining([
      <DataSchema>{
        type: 'delete',
        paths: ['test', 'test1'],
        value: null,
      },
    ]),
  );
});

it('Migrate command will not generate with same value', () => {
  let command = new SetCommand(['test', 'test1'], 'x');

  expect(command.getMigrateCommand({ test: { test1: 'x' } })).toHaveLength(0);
  expect(command.getRevertCommand({ test: { test1: 'x' } })).toHaveLength(0);

  command = new SetCommand(['test', 'test1'], ['a', 'b', 'c']);
  expect(
    command.getMigrateCommand({ test: { test1: ['a', 'b', 'c'] } }),
  ).toHaveLength(0);
  expect(
    command.getRevertCommand({ test: { test1: ['a', 'b', 'c'] } }),
  ).toHaveLength(0);
});
