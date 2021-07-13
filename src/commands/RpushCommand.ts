import cloneDeep from 'lodash.clonedeep';
import { Base, DataSchema } from './Base';

export class RpushCommand extends Base {
  constructor(paths: string[], value: any);
  constructor(command: DataSchema);
  constructor(first: DataSchema | string[], value?: any) {
    super(first as [string, ...string[]], value);
  }

  execute(data: Record<string, any>, createSchema: boolean = true) {
    const currentData = this.getData(data);
    const commands = this.initCommands();

    if (!Array.isArray(currentData)) {
      throw new TypeError(
        `Invalid type ${Object.prototype.toString.call(
          currentData,
        )} to right push item`,
      );
    }

    if (createSchema) {
      commands.up.push({
        type: 'insert',
        paths: this.paths.concat(currentData.length.toString()),
        value: cloneDeep(this.value),
      });
      commands.down.push({
        type: 'delete',
        paths: this.paths.concat(currentData.length.toString()),
        value: null,
      });
    }

    currentData.push(this.value);

    return commands;
  }
}
