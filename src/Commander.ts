import { Base, SchemaItem } from './commands/Base';
import { DeleteCommand } from './commands/DeleteCommand';
import { InsertCommand } from './commands/InsertCommand';
import { SetCommand } from './commands/SetCommand';
import { nanoid } from 'nanoid';

export interface Schema {
  up: SchemaItem[];
  down: SchemaItem[];
  id: string;
}

export class Commander {
  static fromSchema(schema: Schema) {
    return {
      migrate: (data: object) => {
        this.execute(schema.up, data);
      },
      revert: (data: object) => {
        this.execute(schema.down, data);
      },
    };
  }

  protected static execute(schema: SchemaItem[], data: object) {
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
    ).execute(data, false);
  }

  constructor(protected readonly commands: Base[]) {}

  getCommands() {
    return this.commands;
  }

  execute(data: object, createSchema: boolean = true): Schema {
    const schemas: Schema = {
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
