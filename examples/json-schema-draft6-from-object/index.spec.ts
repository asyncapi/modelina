const spy = jest.spyOn(global.console, 'log').mockImplementation(() => {
  return;
});
import { generate } from './index';

describe('Should be able to process JSON Schema draft 6 object', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('and should log expected output to console', async () => {
    await generate();
    //Generate is called 2x, so even though we expect 1 model, we double it
    expect(spy.mock.calls.length).toEqual(2);
    expect(spy.mock.calls[1]).toMatchSnapshot();
  });
});
