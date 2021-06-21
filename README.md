# data-commander

Migrate data from schema.


[![License](https://img.shields.io/github/license/fwh1990/data-commander)](https://github.com/fwh1990/data-commander/blob/main/LICENSE)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/fwh1990/data-commander/CI/main)](https://github.com/fwh1990/data-commander/actions)
[![Codecov](https://img.shields.io/codecov/c/github/fwh1990/data-commander)](https://codecov.io/gh/fwh1990/data-commander)
[![npm](https://img.shields.io/npm/v/data-commander)](https://www.npmjs.com/package/data-commander)


# Installation

```bash
yarn add data-commander
```

# Usage

## Migrate

```typescript
import { Commander, SetCommand, DeleteCommand } from 'data-commander';

const data = {
  x: 1,
  y: 2,
};

const commander = new Commander([
  new SetCommand(['x'], 10),
  new DeleteCommand(['y']),
]);

commander.execute(data);

console.log(data); // { x: 10 }
```

# Create Schema

```typescript
const data = {
  x: 1,
  y: 2,
};

const commander = new Commander([
  new SetCommand(['x'], 10),
  new DeleteCommand(['y']),
]);

commander.toSchema();
// {
//   ups: [
//     { type: 'set', paths: ['x'], value: 10 },
//     { type: 'delete', paths: ['y'], value: null }
//   ],
//   downs: [
//     {type: 'set', paths: ['y'], value: 2 },
//     { type: 'set', paths: ['x'], value: 1 }
//   ],
//   id: 'f899fee0-d25f-11eb-b93f-b58154aca2a5'
// }
```

## Revert

```typescript
const data = {
  x: 1,
  y: 2,
};

const commander = new Commander([
  new SetCommand(['x'], 10),
  new DeleteCommand(['y']),
]);

// Generate schema before execute.
const schema = commander.toSchema(data);

commander.execute(data);
Commander.fromSchema(schema).revert(data);

console.log(data); // { x: 1, y: 2 }
```

# Commands

## SetCommand

Set a value to specific path.

```typescript
const data = {};
const commander = new Commander([
  new SetCommand(['test'], { hello: 'world' })
]);

commander.execute(data);

console.log(data); // { test: { hello: 'world' } }
```

## DeleteCommand

Delete a specific object property or array item.

```typescript
const data = { a: 1, b: 2 };
const commander = new Commander([
  new DeleteCommand(['a'])
]);

commander.execute(data);

console.log(data); // { b: 2 }
```

## InsertCommand

Insert an item to array with specific index.

```typescript
const data = ['a', 'b'];
const commander = new Commander([
  new InsertCommand(['1'], 'c')
]);

commander.execute(data);
console.log(data); // ['a', 'c', 'b']

commander.execute(data);
console.log(data); // ['a', 'c', 'c', 'b']
```

## LpushCommand

Left push an item to array.

```typescript
const data = ['a', 'b'];
const commander = new Commander([
  new LpushCommand([], 'c')
]);

commander.execute(data);
console.log(data); // ['c', 'a', 'b']

commander.execute(data);
console.log(data); // ['c', 'c', 'a', 'b']
```

## RpushCommand

Right push an item to array.

```typescript
const data = ['a', 'b'];
const commander = new Commander([
  new RpushCommand([], 'c')
]);

commander.execute(data);
console.log(data); // ['a', 'b', 'c']

commander.execute(data);
console.log(data); // ['a', 'b', 'c', 'c']
```

## MergeCommand

Merge deep object to another object.

```typescript
const data = {
  x: {
    y: 1,
    z: 3,
  },
};

const commander = new Commander([
  new MergeCommand({
    x: {
      y: 2,
      m: {
        n: 4,
      },
    },
  }),
]);

commander.execute(data);
console.log(data);
// {
//     x: {
//         y: 2,
//         z: 3,
//         m: {
//             n: 4
//         }
//     }
// }
```

OR merge an array item.

```typescript
const data = ['a', 'b'];

const commander = new Commander([
  new MergeCommand(['4': 'c']),
]);

commander.execute(data);
console.log(data); // [ 'a', 'b', <empty>, <empty>, 'c' ]
```
