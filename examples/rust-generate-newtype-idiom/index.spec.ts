const spy = jest.spyOn(global.console, 'log').mockImplementation(() => {
  return;
});
import { generate } from './index';
describe('Should be able to render Rust Models', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('and should log expected output to console', async () => {
    await generate();
    expect(spy.mock.calls.length).toEqual(8);
    expect(spy.mock.calls[0]).toMatchSnapshot();
    expect(spy.mock.calls[1]).toMatchSnapshot();
    expect(spy.mock.calls[2]).toMatchSnapshot();
    expect(spy.mock.calls[3]).toMatchSnapshot();
    expect(spy.mock.calls[4]).toMatchSnapshot();
    expect(spy.mock.calls[5]).toMatchSnapshot();
    expect(spy.mock.calls[6]).toMatchSnapshot();
    expect(spy.mock.calls[7]).toMatchSnapshot();
  });
});
