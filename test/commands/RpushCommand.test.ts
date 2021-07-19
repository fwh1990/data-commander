import { RpushCommand, SchemaItem } from '../../src';

it('can right push array item', () => {
  const data = {
    test: ['a', 'b'],
  };

  const command = new RpushCommand(['test'], 'cc');

  command.execute(data);
  expect(data.test).toHaveLength(3);
  expect(data.test[2]).toBe('cc');

  command.execute(data);
  expect(data.test).toHaveLength(4);
  expect(data.test[3]).toBe('cc');

  command.execute(data);
  expect(data.test).toHaveLength(5);
  expect(data.test[4]).toBe('cc');
});

it('the execute data must be array type', () => {
  const data = {};
  const command = new RpushCommand(['2'], 'cc');

  expect(() => command.execute(data)).toThrowError();
});

it('can create migrate command', () => {
  const command = new RpushCommand([], 'cc');

  expect(command.execute(['aa', 'bb', 'cc'])).toMatchObject({
    up: expect.arrayContaining([
      <SchemaItem>{
        type: 'insert',
        path: ['3'],
        data: 'cc',
      },
    ]),
    down: expect.arrayContaining([
      <SchemaItem>{
        type: 'delete',
        path: ['3'],
        data: null,
      },
    ]),
  });
});
