const spy = jest.spyOn(global.console, 'log').mockImplementation(() => {
  return;
});
import { generate } from './index';

describe('Should be able to generate ts data model with example function', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('and should log expected output to console', async () => {
    await generate();
    expect(spy.mock.calls.length).toEqual(1);
    expect(spy.mock.calls[0]).toMatchSnapshot();
  });
});
