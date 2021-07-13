import cloneDeep from 'lodash.clonedeep';
import { Base, DataSchema } from './Base';

export class DeleteCommand extends Base {
  constructor(pathsOrCommand: DataSchema | [string, ...string[]]) {
    // @ts-ignore
    super(pathsOrCommand, null);
  }

  execute(data: Record<string, any>, createSchema: boolean = true) {
    const parent = this.getParent(data);
    const lastPath = this.getLastPath();
    const shouldDelete = parent.hasOwnProperty(lastPath);
    const commands = this.initCommands();

    if (shouldDelete) {
      createSchema &&
        commands.up.push({
          type: 'delete',
          paths: this.paths,
          value: null,
        });

      if (Array.isArray(parent) && !Number.isNaN(Number(lastPath))) {
        createSchema &&
          commands.down.push({
            type: 'insert',
            paths: this.paths,
            value: cloneDeep(parent[Number(lastPath)]),
          });
        parent.splice(Number(lastPath), 1);
      } else {
        createSchema &&
          commands.down.push({
            type: 'set',
            paths: this.paths,
            value: cloneDeep(parent[lastPath]),
          });
        delete parent[lastPath];
      }
    }

    return commands;
  }
}
