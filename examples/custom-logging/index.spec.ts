const spy = jest.spyOn(global.console, 'log').mockImplementation(() => {
  return;
});
jest.spyOn(global.console, 'debug').mockImplementation(() => {
  return;
});
jest.spyOn(global.console, 'info').mockImplementation(() => {
  return;
});
jest.spyOn(global.console, 'warn').mockImplementation(() => {
  return;
});
jest.spyOn(global.console, 'error').mockImplementation(() => {
  return;
});
import { generate } from './index';
describe('Should be able to use custom logging interface', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('and should log expected output to console', async () => {
    await generate();
    expect(spy.mock.calls.length).toEqual(1);
    expect(spy.mock.calls[0]).toMatchSnapshot();
  });
});
