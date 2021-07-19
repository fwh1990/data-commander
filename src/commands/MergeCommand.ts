import cloneDeep from 'lodash.clonedeep';
import isEqual from 'lodash.isequal';
import { Base } from './Base';

export class MergeCommand extends Base {
  protected readonly toMergeData: any;

  constructor(value: object) {
    super([] as any, null);
    this.toMergeData = value;
  }

  execute(data: Record<string, any>, createSchema: boolean = true) {
    const commands = this.initCommands();

    (function loop(
      obj: Record<string, any>,
      changes: Record<string, any>,
      paths: string[],
    ) {
      Object.keys(changes).forEach((property) => {
        const source = obj[property];
        const foreign = changes[property];

        if (typeof source !== 'object' || typeof foreign !== 'object') {
          if (!isEqual(source, foreign)) {
            if (createSchema) {
              commands.up.push({
                type: 'set',
                path: paths.concat(property),
                data: cloneDeep(foreign),
              });

              if (obj.hasOwnProperty(property)) {
                commands.down.push({
                  type: 'set',
                  path: paths.concat(property),
                  data: cloneDeep(source),
                });
              } else {
                commands.down.push({
                  type: 'delete',
                  path: paths.concat(property),
                  data: null,
                });
              }
            }

            obj[property] = foreign;
          }
        } else {
          loop(source, foreign, paths.concat(property));
        }
      });
    })(data, this.toMergeData, []);

    commands.down.reverse();

    return commands;
  }
}
