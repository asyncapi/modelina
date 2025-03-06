const spy = jest.spyOn(global.console, 'log').mockImplementation(() => {
  return;
});
import { generate } from './index';
describe('Should be able to generate models to files', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('and should log expected output to console', async () => {
    await generate();
    expect(spy.mock.calls.length).toBeGreaterThanOrEqual(1);
    expect(spy.mock.calls[spy.mock.calls.length - 1]).toMatchSnapshot();
  });
});
