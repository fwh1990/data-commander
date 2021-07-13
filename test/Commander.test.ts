import {
  Commander,
  DeleteCommand,
  RpushCommand,
  SchemaCollection,
  SetCommand,
} from '../src';
import { produce } from 'immer';
import isEqual from 'lodash.isequal';

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

  expect(commaner.getCommands()).toHaveLength(4);

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

  const schema = commaner.execute(data);
  const firstMigrated = JSON.stringify(data);
  expect(originalStr).not.toEqual(firstMigrated);

  Commander.fromSchema(schema).revert(data);
  expect(originalStr).toEqual(JSON.stringify(data));

  Commander.fromSchema(schema).migrate(data);
  expect(firstMigrated).toEqual(JSON.stringify(data));
});

it('can revert the commands with immer', () => {
  const original: Record<string, any> = {
    test1: {
      test3: 4,
    },
    test2: [],
  };

  const commaner = new Commander([
    new SetCommand(['test1', 'test2'], 3),
    new SetCommand(['test1', 'test2'], 5),
    new DeleteCommand(['test1', 'test3']),
    new RpushCommand(['test2'], ['a', 'b']),
    new DeleteCommand(['test2', '0']),
    new DeleteCommand(['test1']),
  ]);

  let schema: SchemaCollection;
  let firstMigrated = produce(original, (draft) => {
    schema = commaner.execute(draft);
  });
  expect(isEqual(original, firstMigrated)).toBeFalsy();

  const secondMigrated = produce(firstMigrated, (draft) => {
    Commander.fromSchema(schema!).revert(draft);
  });
  expect(isEqual(original, secondMigrated)).toBeTruthy();

  const thirdMigrated = produce(secondMigrated, (draft) => {
    Commander.fromSchema(schema!).migrate(draft);
  });
  expect(isEqual(firstMigrated, thirdMigrated)).toBeTruthy();
});
