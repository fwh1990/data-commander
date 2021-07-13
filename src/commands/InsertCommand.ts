import { Base } from './Base';

export class InsertCommand extends Base {
  execute(data: Record<number, any>) {
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

    commands.migrate.push({
      type: 'insert',
      paths: this.paths,
      value: this.value,
    });
    commands.revert.push({
      type: 'delete',
      paths: this.paths,
      value: null,
    });
    parent.splice(index, 0, this.value);

    return commands;
  }
}
