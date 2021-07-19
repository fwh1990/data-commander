import cloneDeep from 'lodash.clonedeep';
import { Base, SchemaItem } from './Base';

export class DeleteCommand extends Base {
  constructor(pathsOrCommand: SchemaItem | [string, ...string[]]) {
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
          path: this.paths,
          data: null,
        });

      if (Array.isArray(parent) && !Number.isNaN(Number(lastPath))) {
        createSchema &&
          commands.down.push({
            type: 'insert',
            path: this.paths,
            data: cloneDeep(parent[Number(lastPath)]),
          });
        parent.splice(Number(lastPath), 1);
      } else {
        createSchema &&
          commands.down.push({
            type: 'set',
            path: this.paths,
            data: cloneDeep(parent[lastPath]),
          });
        delete parent[lastPath];
      }
    }

    return commands;
  }
}
