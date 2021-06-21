import { Commander, DeleteCommand, RpushCommand, SetCommand } from '../src';

it('can compose commands', () => {
  const data: Record<string, any> = {
    test1: {
      test3: 4,
    },
  };

  const commaner = new Commander([
    new SetCommand(['test1', 'test2'], 3),
    new DeleteCommand(['test1', 'test3']),
    new SetCommand(['test1', 'test4'], ['a', 'b']),
    new RpushCommand(['test1', 'test4'], 'c'),
  ]);

  commaner.execute(data);
  expect(data.test1.test2).toEqual(3);
  expect(data.test1.test4).toEqual(expect.arrayContaining(['a', 'b', 'c']));
  expect(data.test1.test3).toBeUndefined();
  expect(data.test1.hasOwnProperty('test3')).toBeFalsy();
});

it('can revert the commands', () => {
  const data: Record<string, any> = {
    test1: {
      test3: 4,
    },
    test2: [],
  };

  const originalStr = JSON.stringify(data);

  const commaner = new Commander([
    new SetCommand(['test1', 'test2'], 3),
    new SetCommand(['test1', 'test2'], 5),
    new DeleteCommand(['test1', 'test3']),
    new RpushCommand(['test2'], ['a', 'b']),
    new DeleteCommand(['test2', '0']),
  ]);

  const schema = commaner.toSchema(data);

  commaner.execute(data);
  const firstMigrated = JSON.stringify(data);
  expect(originalStr).not.toEqual(JSON.stringify(firstMigrated));

  Commander.fromCollection(schema).revert(data);
  expect(originalStr).toEqual(JSON.stringify(data));

  Commander.fromCollection(schema).migrate(data);
  expect(firstMigrated).toEqual(JSON.stringify(data));
});
