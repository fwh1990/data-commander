import { Base, DataSchema } from './commands/Base';
import { DeleteCommand } from './commands/DeleteCommand';
import { InsertCommand } from './commands/InsertCommand';
import { SetCommand } from './commands/SetCommand';
import { nanoid } from 'nanoid';

export interface SchemaCollection {
  up: DataSchema[];
  down: DataSchema[];
  id: string;
}

export class Commander {
  static fromSchema(collection: SchemaCollection) {
    return {
      migrate: (data: object) => {
        this.execute(collection.up, data, false);
      },
      revert: (data: object) => {
        this.execute(collection.down, data, false);
      },
    };
  }

  protected static execute(
    schema: DataSchema[],
    data: object,
    createSchema: boolean = true,
  ) {
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
    ).execute(data, createSchema);
  }

  constructor(protected readonly commands: Base[]) {}

  getCommands() {
    return this.commands;
  }

  execute(data: object, createSchema: boolean = true): SchemaCollection {
    const schemas: SchemaCollection = {
      up: [],
      down: [],
      id: nanoid(16),
    };

    this.commands.forEach((command) => {
      const schema = command.execute(data, createSchema);

      if (createSchema) {
        schemas.up.push(...schema.up);
        schemas.down.unshift(...schema.down);
      }
    });

    return schemas;
  }
}
