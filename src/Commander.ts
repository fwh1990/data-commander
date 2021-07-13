import { Base, DataSchema } from './commands/Base';
import { DeleteCommand } from './commands/DeleteCommand';
import { InsertCommand } from './commands/InsertCommand';
import { SetCommand } from './commands/SetCommand';
import { nanoid } from 'nanoid';
import cloneDeep from 'lodash.clonedeep';

export interface SchemaCollection {
  ups: DataSchema[];
  downs: DataSchema[];
  id: string;
}

export class Commander {
  static fromSchema(collection: SchemaCollection) {
    return {
      migrate: (data: object) => {
        return this.execute(collection.ups, data);
      },
      revert: (data: object) => {
        return this.execute(collection.downs, data);
      },
    };
  }

  protected static execute(schema: DataSchema[], data: object) {
    return new Commander(
      schema.map((upCommand) => {
        switch (upCommand.type) {
          case 'set':
            return new SetCommand(upCommand);
          case 'delete':
            return new DeleteCommand(upCommand);
          case 'insert':
            return new InsertCommand(upCommand);
          default:
            throw new TypeError('Unknown command type: ' + upCommand.type);
        }
      }),
    ).execute(data);
  }

  constructor(protected readonly commands: Base[]) {}

  getCommands() {
    return this.commands;
  }

  execute(data: object): SchemaCollection {
    const collection: SchemaCollection = {
      ups: [],
      downs: [],
      id: nanoid(16),
    };

    this.commands.forEach((command) => {
      const { migrate, revert } = command.execute(data);

      collection.ups.push(...migrate);
      collection.downs.unshift(...revert);
    });

    // Clear Proxy effect.
    if (collection.ups.length) {
      collection.ups = cloneDeep(collection.ups);
    }

    // Clear Proxy effect.
    if (collection.downs.length) {
      collection.downs = cloneDeep(collection.downs);
    }

    return collection;
  }
}
