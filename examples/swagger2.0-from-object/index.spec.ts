const spy = jest.spyOn(global.console, 'log').mockImplementation(() => { return; });
import { generate } from './index';
describe('Should be able to process a pure Swagger 2.0 object', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('and should log expected output to console', async () => {
    await generate();
    //Generate is called 2x, so even though we expect 2 models, we double it
    expect(spy.mock.calls.length).toEqual(4);
    expect(spy.mock.calls[2]).toMatchSnapshot();
    expect(spy.mock.calls[3]).toMatchSnapshot();
  });
});
