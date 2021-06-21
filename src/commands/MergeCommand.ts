import isEqual from 'lodash.isequal';
import { Base, DataSchema } from './Base';

export class MergeCommand extends Base {
  protected readonly toMergeData: any;

  constructor(value: object) {
    super([] as any, null);
    this.toMergeData = value;
  }

  execute(data: Record<string, any>): void {
    this.merge(data, this.toMergeData);
  }

  getMigrateCommand(data: Record<string, any>): DataSchema[] {
    const collections: DataSchema[] = [];

    (function loop(
      obj: Record<string, any>,
      changes: Record<string, any>,
      paths: string[],
    ) {
      Object.keys(changes).forEach((property) => {
        const source = obj[property];
        const foreign = changes[property];

        if (typeof source !== 'object' || typeof foreign !== 'object') {
          isEqual(source, foreign) ||
            collections.push({
              type: 'set',
              paths: paths.concat(property),
              value: foreign,
            });
        } else {
          loop(source, foreign, paths.concat(property));
        }
      });
    })(data, this.toMergeData, []);

    return collections;
  }

  getRevertCommand(data: Record<string, any>): DataSchema[] {
    const collections: DataSchema[] = [];

    (function loop(
      obj: Record<string, any>,
      changes: Record<string, any>,
      paths: string[],
    ) {
      Object.keys(changes).forEach((property) => {
        const source = obj[property];
        const foreign = changes[property];

        if (!obj.hasOwnProperty(property)) {
          collections.push({
            type: 'delete',
            paths: paths.concat(property),
            value: null,
          });
        } else if (typeof source !== 'object' || typeof foreign !== 'object') {
          isEqual(source, foreign) ||
            collections.push({
              type: 'set',
              paths: paths.concat(property),
              value: source,
            });
        } else {
          loop(source, foreign, paths.concat(property));
        }
      });
    })(data, this.toMergeData, []);

    return collections.reverse();
  }

  protected merge(data: Record<string, any>, changes: Record<string, any>) {
    Object.keys(changes).forEach((property) => {
      const source = data[property];
      const foreign = changes[property];

      if (source === undefined || typeof foreign !== 'object') {
        isEqual(source, foreign) || (data[property] = foreign);
      } else {
        this.merge(source, foreign);
      }
    });
  }
}
