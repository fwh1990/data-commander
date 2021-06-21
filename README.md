# data-commander

Migrate data from schema.

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

## SetCommand

Set a value to specific path.

## DeleteCommand

Delete a specific object property or array item.

## InsertCommand

Insert an item to array with specific index.

## LpushCommand

Left push an item to array.

## RpushCommand

Right push an item to array.
