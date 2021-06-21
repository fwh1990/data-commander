import { Base, DataSchema } from './Base';

export class InsertCommand extends Base {
  execute(data: Record<number, any>) {
    const [parent, index] = this.validate(data);

    parent.splice(index, 0, this.value);
  }

  getMigrateCommand(data: Record<string, any>): DataSchema[] {
    this.validate(data);

    return [
      {
        type: 'insert',
        paths: this.paths,
        value: this.value,
      },
    ];
  }

  getRevertCommand(data: Record<string, any>): DataSchema[] {
    this.validate(data);

    return [
      {
        type: 'delete',
        paths: this.paths,
        value: null,
      },
    ];
  }

  protected validate(data: Record<string, any>): [any[], number] {
    const parent = this.getParent(data);
    const lastPath = Number(this.getLastPath());

    if (!Array.isArray(parent)) {
      throw new TypeError(
        `Invalid type ${Object.prototype.toString.call(parent)} to insert item`,
      );
    }

    if (Number.isNaN(lastPath)) {
      throw new TypeError(`Array key is not a number`);
    }

    return [parent, lastPath];
  }
}
