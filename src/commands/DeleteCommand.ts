import { Base, DataSchema } from './Base';

export class DeleteCommand extends Base {
  constructor(pathsOrCommand: DataSchema | [string, ...string[]]) {
    // @ts-ignore
    super(pathsOrCommand, null);
  }

  execute(data: Record<string, any>) {
    const parent = this.getParent(data);
    const lastPath = this.getLastPath();

    if (parent.hasOwnProperty(lastPath)) {
      if (Array.isArray(parent) && !Number.isNaN(Number(lastPath))) {
        parent.splice(Number(lastPath), 1);
      } else {
        delete parent[lastPath];
      }
    }
  }

  getMigrateCommand(data: Record<string, any>): DataSchema[] {
    const [should] = this.shouldDelete(data);

    if (!should) {
      return [];
    }

    return [
      {
        type: 'delete',
        paths: this.paths,
        value: null,
      },
    ];
  }

  getRevertCommand(data: Record<string, any>): DataSchema[] {
    const [should, parent, value] = this.shouldDelete(data);

    if (!should) {
      return [];
    }

    if (Array.isArray(parent)) {
      return [
        {
          type: 'insert',
          paths: this.paths,
          value,
        },
      ];
    }

    return [
      {
        type: 'set',
        paths: this.paths,
        value: value,
      },
    ];
  }

  protected shouldDelete(data: Record<string, any>): [boolean, any, any] {
    const parent = this.getParent(data);
    const lastPath = this.getLastPath();

    return [parent.hasOwnProperty(lastPath), parent, parent[lastPath]];
  }
}
