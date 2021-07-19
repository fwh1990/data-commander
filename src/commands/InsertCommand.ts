import cloneDeep from 'lodash.clonedeep';
import { Base } from './Base';

export class InsertCommand extends Base {
  execute(data: Record<number, any>, createSchema: boolean = true) {
    const parent = this.getParent(data);
    const index = Number(this.getLastPath());
    const commands = this.initCommands();

    if (!Array.isArray(parent)) {
      throw new TypeError(
        `Invalid type ${Object.prototype.toString.call(parent)} to insert item`,
      );
    }

    if (Number.isNaN(index)) {
      throw new TypeError(`Array key is not a number`);
    }

    if (createSchema) {
      commands.up.push({
        type: 'insert',
        path: this.paths,
        data: cloneDeep(this.value),
      });
      commands.down.push({
        type: 'delete',
        path: this.paths,
        data: null,
      });
    }

    parent.splice(index, 0, this.value);

    return commands;
  }
}
