const spy = jest.spyOn(global.console, 'log').mockImplementation(() => { return; });
import { generate } from './index';
describe('Should be able to render Rust Models', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('and should log expected output to console', async () => {
    await generate();
    expect(spy.mock.calls.length).toEqual(9);
    expect(spy.mock.calls).toMatchSnapshot();
  });
});
