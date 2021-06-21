import cloneDeep from 'lodash.clonedeep';
import { Base, DataSchema } from './commands/Base';
import { DeleteCommand } from './commands/DeleteCommand';
import { InsertCommand } from './commands/InsertCommand';
import { SetCommand } from './commands/SetCommand';
import * as uuid from 'uuid';

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

  constructor(protected commands: Base[]) {}

  execute(data: object) {
    return this.commands.forEach((command) => command.execute(data));
  }

  toSchema(data: object): SchemaCollection {
    data = cloneDeep(data);
    const ups: DataSchema[] = [];
    const downs: DataSchema[] = [];

    this.commands.forEach((command) => {
      ups.push(...command.getMigrateCommand(data));
      downs.unshift(...command.getRevertCommand(data));

      command.execute(data);
    });

    return {
      ups: ups,
      downs: downs,
      id: uuid.v1(),
    };
  }
}
