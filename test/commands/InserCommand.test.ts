import { InsertCommand, SchemaItem } from '../../src';

it('can insert array item', () => {
  const data = {
    test: ['a', 'b'],
  };

  const command = new InsertCommand(['test', '2'], 'cc');

  command.execute(data);
  expect(data.test).toHaveLength(3);
  expect(data.test[2]).toBe('cc');

  command.execute(data);
  expect(data.test).toHaveLength(4);
  expect(data.test[2]).toBe('cc');

  command.execute(data);
  expect(data.test).toHaveLength(5);
  expect(data.test[2]).toBe('cc');
});

it('the execute data must be array type', () => {
  const data = {};
  const command = new InsertCommand(['2'], 'cc');

  expect(() => command.execute(data)).toThrowError();
});

it('the last key should be number', () => {
  const data: string[] = [];
  const command = new InsertCommand(['not-number'], 'cc');

  expect(() => command.execute(data)).toThrowError();
});

it('can create migrate command', () => {
  const command = new InsertCommand(['2'], 'cc');

  expect(command.execute(['aa', 'bb', 'cc'])).toMatchObject({
    up: expect.arrayContaining([
      <SchemaItem>{
        type: 'insert',
        path: ['2'],
        data: 'cc',
      },
    ]),
    down: expect.arrayContaining([
      <SchemaItem>{
        type: 'delete',
        path: ['2'],
        data: null,
      },
    ]),
  });
});
