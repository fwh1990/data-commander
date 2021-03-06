import { MergeCommand, SchemaItem } from '../../src';

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
    up: expect.arrayContaining([
      <SchemaItem>{
        type: 'set',
        path: ['test'],
        data: {
          test1: 3,
        },
      },
    ]),
    down: expect.arrayContaining([
      <SchemaItem>{
        type: 'delete',
        path: ['test'],
        data: null,
      },
    ]),
  });

  expect(command.execute({ test: {} })).toMatchObject({
    up: expect.arrayContaining([
      <SchemaItem>{
        type: 'set',
        path: ['test', 'test1'],
        data: 3,
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

  expect(command.execute({ test: 'x' })).toMatchObject({
    up: expect.arrayContaining([
      <SchemaItem>{
        type: 'set',
        path: ['test'],
        data: {
          test1: 3,
        },
      },
    ]),
    down: expect.arrayContaining([
      <SchemaItem>{
        type: 'set',
        path: ['test'],
        data: 'x',
      },
    ]),
  });

  expect(command.execute({ test: { test1: 2 } })).toMatchObject({
    up: expect.arrayContaining([
      <SchemaItem>{
        type: 'set',
        path: ['test', 'test1'],
        data: 3,
      },
    ]),
    down: expect.arrayContaining([
      <SchemaItem>{
        type: 'set',
        path: ['test', 'test1'],
        data: 2,
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

  expect(command.execute({ test: { test1: 3 } }).up).toHaveLength(0);
  expect(command.execute({ test: { test1: 3 } }).down).toHaveLength(0);
});
