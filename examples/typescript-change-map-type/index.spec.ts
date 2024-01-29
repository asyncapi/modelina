const spy = jest.spyOn(global.console, 'log').mockImplementation(() => {
  return;
});
import { generate } from './index';

describe('Should be able to render correct map type based on options', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('and should log expected output to console', async (): Promise<void> => {
    await generate();
    expect(spy.mock.calls.length).toEqual(6);
    expect(spy.mock.calls[0]).toMatchSnapshot();
  });
});
