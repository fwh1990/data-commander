import { Base, DataSchema } from './Base';

export class LpushCommand extends Base {
  constructor(paths: string[], value: any);
  constructor(command: DataSchema);
  constructor(first: DataSchema | string[], value?: any) {
    super(first as [string, ...string[]], value);
  }

  execute(data: Record<string, any>) {
    const currentData = this.validate(data);

    currentData.unshift(this.value);
  }

  getMigrateCommand(data: Record<string, any>): DataSchema[] {
    this.validate(data);

    return [
      {
        type: 'insert',
        paths: this.paths.concat('0'),
        value: this.value,
      },
    ];
  }

  getRevertCommand(data: Record<string, any>): DataSchema[] {
    this.validate(data);

    return [
      {
        type: 'delete',
        paths: this.paths.concat('0'),
        value: null,
      },
    ];
  }

  protected validate(data: Record<string, any>): any[] {
    const currentData = this.getData(data);

    if (!Array.isArray(currentData)) {
      throw new TypeError(
        `Invalid type ${Object.prototype.toString.call(
          currentData,
        )} to left push item`,
      );
    }

    return currentData;
  }
}
