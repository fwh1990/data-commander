import isEqual from 'lodash.isequal';
import { Base, DataSchema } from './Base';

export class SetCommand extends Base {
  execute(data: Record<string, any>) {
    const parent = this.getParent(data);
    const lastPath = this.getLastPath();

    if (!isEqual(parent[lastPath], this.value)) {
      parent[lastPath] = this.value;
    }
  }

  getMigrateCommand(data: Record<string, any>): DataSchema[] {
    const parent = this.getParent(data);
    const lastPath = this.getLastPath();

    if (isEqual(parent[lastPath], this.value)) {
      return [];
    }

    return [
      {
        type: 'set',
        paths: this.paths,
        value: this.value,
      },
    ];
  }

  getRevertCommand(data: Record<string, any>): DataSchema[] {
    const parent = this.getParent(data);
    const lastPath = this.getLastPath();

    if (isEqual(parent[lastPath], this.value)) {
      return [];
    }

    if (parent.hasOwnProperty(lastPath)) {
      return [
        {
          type: 'set',
          paths: this.paths,
          value: parent[lastPath],
        },
      ];
    }

    return [
      {
        type: 'delete',
        paths: this.paths,
        value: null,
      },
    ];
  }
}
