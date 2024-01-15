const spy = jest.spyOn(global.console, 'log').mockImplementation(() => {
  return;
});
import { generate } from './index';

describe('Should be able to render models to ESM module system', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('and should log expected output to console', async () => {
    await generate();
    expect(spy.mock.calls.length).toEqual(2);
    expect(spy.mock.calls[0]).toMatchSnapshot();
    expect(spy.mock.calls[1]).toMatchSnapshot();
  });
});
