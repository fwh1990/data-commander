export interface SchemaItem {
  type: 'set' | 'delete' | 'insert';
  path: string[];
  data: any;
}

export abstract class Base {
  protected readonly paths: string[];
  protected readonly value: any;

  constructor(paths: string[], value: any);
  constructor(schema: SchemaItem);
  constructor(first: SchemaItem | string[], value?: any) {
    if (Array.isArray(first)) {
      this.paths = first;
      this.value = value;
    } else {
      this.paths = first.path;
      this.value = first.data;
    }
  }

  getPaths() {
    return this.paths;
  }

  protected getParent(data: Record<string, any>) {
    return this.paths.slice(0, -1).reduce((carry, path) => {
      return carry[path];
    }, data);
  }

  protected getData(data: Record<string, any>) {
    return this.paths.reduce((carry, path) => {
      return carry[path];
    }, data);
  }

  protected getLastPath(): string {
    return this.paths[this.paths.length - 1]!;
  }

  abstract execute(
    data: Record<string, any>,
    createSchema?: boolean,
  ): {
    up: SchemaItem[];
    down: SchemaItem[];
  };

  protected initCommands(): {
    up: SchemaItem[];
    down: SchemaItem[];
  } {
    return {
      up: [],
      down: [],
    };
  }
}
