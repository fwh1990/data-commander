import isEqual from 'lodash.isequal';
import { Base } from './Base';

export class SetCommand extends Base {
  execute(data: Record<string, any>) {
    const parent = this.getParent(data);
    const lastPath = this.getLastPath();
    const commands = this.initCommands();

    if (!isEqual(parent[lastPath], this.value)) {
      commands.migrate.push({
        type: 'set',
        paths: this.paths,
        value: this.value,
      });

      if (parent.hasOwnProperty(lastPath)) {
        commands.revert.push({
          type: 'set',
          paths: this.paths,
          value: parent[lastPath],
        });
      } else {
        commands.revert.push({
          type: 'delete',
          paths: this.paths,
          value: null,
        });
      }

      parent[lastPath] = this.value;
    }

    return commands;
  }
}
