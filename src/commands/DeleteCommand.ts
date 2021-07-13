import { Base, DataSchema } from './Base';

export class DeleteCommand extends Base {
  constructor(pathsOrCommand: DataSchema | [string, ...string[]]) {
    // @ts-ignore
    super(pathsOrCommand, null);
  }

  execute(data: Record<string, any>) {
    const parent = this.getParent(data);
    const lastPath = this.getLastPath();
    const shouldDelete = parent.hasOwnProperty(lastPath);
    const commands = this.initCommands();

    if (shouldDelete) {
      commands.migrate.push({
        type: 'delete',
        paths: this.paths,
        value: null,
      });

      if (Array.isArray(parent) && !Number.isNaN(Number(lastPath))) {
        commands.revert.push({
          type: 'insert',
          paths: this.paths,
          value: parent[Number(lastPath)],
        });
        parent.splice(Number(lastPath), 1);
      } else {
        commands.revert.push({
          type: 'set',
          paths: this.paths,
          value: parent[lastPath],
        });
        delete parent[lastPath];
      }
    }

    return commands;
  }
}
