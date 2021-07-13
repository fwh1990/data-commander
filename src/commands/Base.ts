export interface DataSchema {
  type: 'set' | 'delete' | 'insert';
  paths: string[];
  value: any;
}

export abstract class Base {
  protected readonly paths: string[];
  protected readonly value: any;

  constructor(paths: [string, ...string[]], value: any);
  constructor(schema: DataSchema);
  constructor(first: DataSchema | string[], value?: any) {
    if (Array.isArray(first)) {
      this.paths = first;
      this.value = value;
    } else {
      this.paths = first.paths;
      this.value = first.value;
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
    up: DataSchema[];
    down: DataSchema[];
  };

  protected initCommands(): {
    up: DataSchema[];
    down: DataSchema[];
  } {
    return {
      up: [],
      down: [],
    };
  }
}
