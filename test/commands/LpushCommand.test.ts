import { LpushCommand, DataSchema } from '../../src';

it('can left push array item', () => {
  const data = {
    test: ['a', 'b'],
  };

  const command = new LpushCommand(['test'], 'cc');

  command.execute(data);
  expect(data.test).toHaveLength(3);
  expect(data.test[0]).toBe('cc');

  command.execute(data);
  expect(data.test).toHaveLength(4);
  expect(data.test[0]).toBe('cc');

  command.execute(data);
  expect(data.test).toHaveLength(5);
  expect(data.test[0]).toBe('cc');
});

it('the execute data must be array type', () => {
  const data = {};
  const command = new LpushCommand(['2'], 'cc');

  expect(() => command.execute(data)).toThrowError();
});

it('can create migrate command', () => {
  const command = new LpushCommand([], 'cc');

  expect(command.execute(['aa', 'bb', 'cc'])).toMatchObject({
    migrate: expect.arrayContaining([
      <DataSchema>{
        type: 'insert',
        paths: ['0'],
        value: 'cc',
      },
    ]),
    revert: expect.arrayContaining([
      <DataSchema>{
        type: 'delete',
        paths: ['0'],
        value: null,
      },
    ]),
  });
});
