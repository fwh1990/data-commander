import cloneDeep from 'lodash.clonedeep';
import isEqual from 'lodash.isequal';
import { Base } from './Base';

export class SetCommand extends Base {
  execute(data: Record<string, any>, createSchema: boolean = true) {
    const parent = this.getParent(data);
    const lastPath = this.getLastPath();
    const commands = this.initCommands();

    if (!isEqual(parent[lastPath], this.value)) {
      if (createSchema) {
        commands.up.push({
          type: 'set',
          path: this.paths,
          data: cloneDeep(this.value),
        });

        if (parent.hasOwnProperty(lastPath)) {
          commands.down.push({
            type: 'set',
            path: this.paths,
            data: cloneDeep(parent[lastPath]),
          });
        } else {
          commands.down.push({
            type: 'delete',
            path: this.paths,
            data: null,
          });
        }
      }

      parent[lastPath] = this.value;
    }

    return commands;
  }
}
