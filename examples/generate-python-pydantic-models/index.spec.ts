const spy = jest.spyOn(global.console, 'log').mockImplementation(() => {
  return;
});
import { generate } from './index';

describe('Should be able to render python models', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('and should log expected output to console', async () => {
    await generate();
    expect(spy.mock.calls.length).toEqual(2);
    expect(spy.mock.calls[0]).toMatchSnapshot('class-model');
    expect(spy.mock.calls[1]).toMatchSnapshot('enum-model');
  });
});
