import cloneDeep from 'lodash.clonedeep';
import { Base, SchemaItem } from './Base';

export class LpushCommand extends Base {
  constructor(paths: string[], value: any);
  constructor(command: SchemaItem);
  constructor(first: SchemaItem | string[], value?: any) {
    super(first as [string, ...string[]], value);
  }

  execute(data: Record<string, any>, createSchema: boolean = true) {
    const currentData = this.getData(data);
    const commands = this.initCommands();

    if (!Array.isArray(currentData)) {
      throw new TypeError(
        `Invalid type ${Object.prototype.toString.call(
          currentData,
        )} to left push item`,
      );
    }

    if (createSchema) {
      commands.up.push({
        type: 'insert',
        path: this.paths.concat('0'),
        data: cloneDeep(this.value),
      });
      commands.down.push({
        type: 'delete',
        path: this.paths.concat('0'),
        data: null,
      });
    }

    currentData.unshift(this.value);

    return commands;
  }
}
