import { MergeCommand, DataSchema } from '../../src';

it('can merge deep object', () => {
  const data1: Record<string, any> = {};
  const data2: Record<string, any> = {
    test: {
      test10: 45,
    },
    test4: '12',
  };

  const command = new MergeCommand({
    test: {
      test1: 3,
      test2: {
        test3: 4,
      },
    },
    test4: 5,
  });

  command.execute(data1);
  expect(data1.test.test1).toEqual(3);
  expect(data1.test.test2.test3).toEqual(4);
  expect(data1.test4).toEqual(5);

  command.execute(data2);
  expect(data2.test.test1).toEqual(3);
  expect(data2.test.test2.test3).toEqual(4);
  expect(data2.test4).toEqual(5);
  expect(data2.test.test10).toEqual(45);
});

it('can merge array', () => {
  const data: Record<string, any> = {
    test: {
      test1: 45,
      test2: ['a', 'c'],
    },
  };

  const command = new MergeCommand({
    test: {
      test2: (() => {
        const tmp: number[] = [];
        tmp[3] = 56;

        return tmp;
      })(),
    },
  });

  command.execute(data);
  expect(data.test.test2).toHaveLength(4);
  expect(data.test.test2[3]).toEqual(56);
});

it('can create migrate command', () => {
  const command = new MergeCommand({
    test: {
      test1: 3,
    },
  });

  expect(command.execute({})).toMatchObject({
    migrate: expect.arrayContaining([
      <DataSchema>{
        type: 'set',
        paths: ['test'],
        value: {
          test1: 3,
        },
      },
    ]),
    revert: expect.arrayContaining([
      <DataSchema>{
        type: 'delete',
        paths: ['test'],
        value: null,
      },
    ]),
  });

  expect(command.execute({ test: {} })).toMatchObject({
    migrate: expect.arrayContaining([
      <DataSchema>{
        type: 'set',
        paths: ['test', 'test1'],
        value: 3,
      },
    ]),
    revert: expect.arrayContaining([
      <DataSchema>{
        type: 'delete',
        paths: ['test', 'test1'],
        value: null,
      },
    ]),
  });

  expect(command.execute({ test: 'x' })).toMatchObject({
    migrate: expect.arrayContaining([
      <DataSchema>{
        type: 'set',
        paths: ['test'],
        value: {
          test1: 3,
        },
      },
    ]),
    revert: expect.arrayContaining([
      <DataSchema>{
        type: 'set',
        paths: ['test'],
        value: 'x',
      },
    ]),
  });

  expect(command.execute({ test: { test1: 2 } })).toMatchObject({
    migrate: expect.arrayContaining([
      <DataSchema>{
        type: 'set',
        paths: ['test', 'test1'],
        value: 3,
      },
    ]),
    revert: expect.arrayContaining([
      <DataSchema>{
        type: 'set',
        paths: ['test', 'test1'],
        value: 2,
      },
    ]),
  });
});

it('Migrate command will not generate with same value', () => {
  const command = new MergeCommand({
    test: {
      test1: 3,
    },
  });

  expect(command.execute({ test: { test1: 3 } }).migrate).toHaveLength(0);
  expect(command.execute({ test: { test1: 3 } }).revert).toHaveLength(0);
});
